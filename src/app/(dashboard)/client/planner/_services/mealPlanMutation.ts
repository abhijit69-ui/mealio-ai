"use server";

import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { addDays, startOfWeek, endOfWeek } from "date-fns";
import { Day, MealType } from "$/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { GeneratePlanWithAIInput } from "../_types/aiMealPlanSchema";

const planInclude = {
  items: {
    include: {
      meal: {
        include: {
          mealFoods: { include: { food: true, servingUnit: true } },
        },
      },
    },
  },
};

export const getOrCreateCurrentWeekPlan = async (userId: string) => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const existing = await db.mealPlan.findFirst({
    where: { userId, startDate: { gte: start }, endDate: { lte: end } },
    include: planInclude,
  });

  if (existing) return existing;

  return await db.mealPlan.create({
    data: { userId, name: "My Weekly Plan", startDate: start, endDate: end },
    include: planInclude,
  });
};

export const getUserPlans = async (userId: string) => {
  return await db.mealPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
};

export const getPlanById = async (planId: number, userId: string) => {
  return await db.mealPlan.findFirst({
    where: { id: planId, userId },
    include: planInclude,
  });
};

export const createPlan = async ({
  userId,
  name,
  startDate,
}: {
  userId: string;
  name: string;
  startDate: Date;
}) => {
  const endDate = addDays(startDate, 6);
  const plan = await db.mealPlan.create({
    data: { userId, name, startDate, endDate },
  });
  revalidatePath("/client/planner"); // ← revalidate list page
  return plan;
};

export const deletePlan = async (planId: number) => {
  await executeAction({
    actionFn: async () => {
      await db.mealPlan.delete({ where: { id: planId } });
      revalidatePath("/client/planner"); // ← revalidate list page
    },
  });
};

const findOrCreateServingUnit = async (name: string): Promise<number> => {
  const existing = await db.servingUnit.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) return existing.id;
  const created = await db.servingUnit.create({ data: { name } });
  return created.id;
};

export const assignMealToPlanSlot = async ({
  planId,
  day,
  type,
  userId,
  mealFoods,
}: {
  planId: number;
  day: Day;
  type: MealType;
  userId: string;
  mealFoods: {
    foodId: number;
    servingUnitId: number;
    servingUnitName?: string;
    amount: number;
  }[];
}) => {
  await executeAction({
    actionFn: async () => {
      const existingItem = await db.mealPlanItem.findUnique({
        where: { planId_day_type: { planId, day, type } },
      });

      if (existingItem) {
        await db.mealFood.deleteMany({
          where: { mealId: existingItem.mealId },
        });
        await db.mealPlanItem.delete({ where: { id: existingItem.id } });
        await db.meal.delete({ where: { id: existingItem.mealId } });
      }

      const meal = await db.meal.create({
        data: { userId, dateTime: new Date(), type },
      });

      await Promise.all(
        mealFoods.map(async (f) => {
          let resolvedServingUnitId = f.servingUnitId;
          if (resolvedServingUnitId === 0 && f.servingUnitName) {
            resolvedServingUnitId = await findOrCreateServingUnit(
              f.servingUnitName,
            );
          } else if (resolvedServingUnitId === 0) {
            resolvedServingUnitId = await findOrCreateServingUnit("serving");
          }
          return db.mealFood.create({
            data: {
              mealId: meal.id,
              foodId: f.foodId,
              servingUnitId: resolvedServingUnitId,
              amount: f.amount,
            },
          });
        }),
      );

      await db.mealPlanItem.create({
        data: { planId, mealId: meal.id, day, type },
      });

      revalidatePath(`/client/planner/${planId}`); // ← revalidate plan detail
      revalidatePath("/client/planner");
    },
  });
};

export const removeMealFromSlot = async (planItemId: number) => {
  await executeAction({
    actionFn: async () => {
      const item = await db.mealPlanItem.findUnique({
        where: { id: planItemId },
      });
      if (!item) return;
      await db.mealFood.deleteMany({ where: { mealId: item.mealId } });
      await db.mealPlanItem.delete({ where: { id: planItemId } });
      await db.meal.delete({ where: { id: item.mealId } });

      revalidatePath(`/client/planner/${item.planId}`); // ← revalidate plan detail
      revalidatePath("/client/planner");
    },
  });
};

export type ServingUnitEntry = {
  name: string;
  grams: number;
};

export const createPersonalFood = async ({
  userId,
  name,
  calories,
  protein,
  carbohydrate,
  fat,
  description,
  servingUnits,
}: {
  userId: string;
  name: string;
  calories: string;
  protein: string;
  carbohydrate: string;
  fat: string;
  description: string;
  servingUnits: ServingUnitEntry[];
}) => {
  const food = await db.food.create({
    data: {
      name,
      userId,
      isPublic: false,
      description: description || null,
      calories: calories ? Number(calories) : null,
      protein: protein ? Number(protein) : null,
      carbohydrate: carbohydrate ? Number(carbohydrate) : null,
      fat: fat ? Number(fat) : null,
    },
  });

  await Promise.all(
    servingUnits.map(async (unit) => {
      const servingUnitId = await findOrCreateServingUnit(unit.name);
      await db.foodServingUnit.create({
        data: { foodId: food.id, servingUnitId, grams: unit.grams },
      });
    }),
  );

  // no revalidatePath needed — food list is client-side via React Query
  return food;
};

export const deletePersonalFood = async (foodId: number) => {
  await executeAction({
    actionFn: async () => {
      await db.food.delete({ where: { id: foodId } });
      // no revalidatePath needed — food list is client-side via React Query
    },
  });
};

export const updateMealPlanItemImage = async (
  planItemId: number,
  imageUrl: string | null,
) => {
  await executeAction({
    actionFn: async () => {
      const item = await db.mealPlanItem.update({
        where: { id: planItemId },
        data: { image: imageUrl },
      });
      revalidatePath(`/client/planner/${item.planId}`);
    },
  });
};

export const updateFoodDescription = async (
  foodId: number,
  description: string,
) => {
  await executeAction({
    actionFn: async () => {
      await db.food.update({
        where: { id: foodId },
        data: { description: description.trim() || null },
      });
    },
  });
};

// AI Generation action

export async function generateMealPlanWithAI(input: GeneratePlanWithAIInput) {
  const {
    userId,
    name,
    startDate,
    goal,
    availableIngredients,
    foodsToAvoid,
    dietaryRestrictions,
    budget,
  } = input;

  // Create the plan first
  const plan = await createPlan({
    userId,
    name: name || `AI Meal Plan - ${goal.replace("_", " ")}`,
    startDate: new Date(startDate),
  });

  const goalDescriptions: Record<string, string> = {
    weight_loss:
      "Focus on low-calorie, high-fiber meals. Use generous vegetables, lean proteins, and moderate portions. Total daily: 1500-1800 calories.",
    muscle_gain:
      "High-protein with complex carbs. Include chicken, fish, eggs, rice, potatoes. Larger portions for muscle building. Total daily: 2500-3000 calories.",
    maintenance:
      "Balanced meals with all food groups. Proteins, grains, vegetables, and healthy fats. Moderate portions. Total daily: 2000-2200 calories.",
    high_protein:
      "Very high protein (30g+ per meal). Eggs, chicken, fish, Greek yogurt, cottage cheese. Each meal should be protein-focused. Total daily: 2200-2500 calories.",
    energy_boost:
      "Complex carbs for sustained energy. Oats, brown rice, fruits, nuts. Avoid sugar spikes. Include protein for fullness. Total daily: 2000-2400 calories.",
    healthy_eating:
      "Whole, unprocessed foods. Colorful vegetables, lean proteins, whole grains. Mindful portions. Total daily: 1800-2200 calories.",
  };

  const budgetDescriptions: Record<string, string> = {
    budget:
      "Use eggs, rice, beans, lentils, potatoes, oats, seasonal vegetables, pasta.",
    moderate:
      "Include chicken, fish, whole grains, variety of vegetables and fruits.",
    premium:
      "Include salmon, lean beef, quinoa, avocado, nuts, berries, organic ingredients.",
  };

  const dietaryMap: Record<string, string> = {
    vegetarian:
      "STRICTLY VEGETARIAN - No meat, fish, or poultry. Use eggs, dairy, legumes.",
    vegan:
      "STRICTLY VEGAN - No animal products. Use tofu, tempeh, legumes, plant milk.",
    non_vegetarian: "Include all meat, fish, poultry, eggs.",
    lactose_free:
      "No milk, cheese, yogurt, dairy. Use lactose-free alternatives.",
    gluten_free:
      "No wheat, barley, rye. Use rice, quinoa, corn, gluten-free oats.",
  };

  const dietaryText = dietaryRestrictions?.length
    ? dietaryRestrictions.map((d) => dietaryMap[d]).join("; ")
    : "No specific dietary restrictions.";

  const ingredientsText = availableIngredients
    ? `Use these available ingredients: ${availableIngredients}`
    : "Use common, easily available ingredients.";

  const avoidText = foodsToAvoid ? `AVOID: ${foodsToAvoid}` : "";

  const prompt = `You are a nutritionist creating a practical 7-day meal plan.

GOAL: ${goalDescriptions[goal]}
DIET: ${dietaryText}
${ingredientsText}
${avoidText}
${budget ? `BUDGET: ${budgetDescriptions[budget]}` : ""}

FOOD DATABASE - Use ONLY these foods with EXACT nutrition values (per 100g):

PROTEINS:
- Eggs (whole): 155 cal, 13g protein, 11g fat, 1g carbs, 0g fiber, 1g sugar
- Chicken breast: 165 cal, 31g protein, 4g fat, 0g carbs, 0g fiber, 0g sugar
- Salmon: 208 cal, 20g protein, 13g fat, 0g carbs, 0g fiber, 0g sugar
- Tofu (firm): 76 cal, 8g protein, 5g fat, 2g carbs, 0g fiber, 0g sugar
- Paneer: 265 cal, 18g protein, 21g fat, 1g carbs, 0g fiber, 1g sugar

GRAINS & CARBS:
- White rice (cooked): 130 cal, 3g protein, 0g fat, 28g carbs, 0g fiber, 0g sugar
- Brown rice (cooked): 112 cal, 3g protein, 1g fat, 24g carbs, 2g fiber, 1g sugar
- Oats (cooked): 71 cal, 3g protein, 3g fat, 12g carbs, 2g fiber, 1g sugar
- Whole wheat bread: 247 cal, 13g protein, 4g fat, 41g carbs, 7g fiber, 6g sugar
- Roti/Chapati: 120 cal, 3g protein, 3g fat, 20g carbs, 2g fiber, 1g sugar
- Pasta (cooked): 131 cal, 5g protein, 1g fat, 25g carbs, 1g fiber, 1g sugar

VEGETABLES:
- Broccoli: 34 cal, 3g protein, 0g fat, 7g carbs, 3g fiber, 2g sugar
- Spinach: 23 cal, 3g protein, 0g fat, 4g carbs, 2g fiber, 0g sugar
- Mixed vegetables: 42 cal, 2g protein, 0g fat, 8g carbs, 3g fiber, 3g sugar
- Cucumber: 15 cal, 1g protein, 0g fat, 3g carbs, 1g fiber, 2g sugar
- Carrot: 41 cal, 1g protein, 0g fat, 10g carbs, 3g fiber, 5g sugar

DAIRY:
- Greek yogurt: 59 cal, 10g protein, 0g fat, 4g carbs, 0g fiber, 4g sugar
- Milk: 42 cal, 3g protein, 1g fat, 5g carbs, 0g fiber, 5g sugar
- Paneer: 265 cal, 18g protein, 21g fat, 1g carbs, 0g fiber, 1g sugar

FRUITS:
- Banana: 89 cal, 1g protein, 0g fat, 23g carbs, 3g fiber, 12g sugar
- Apple: 52 cal, 0g protein, 0g fat, 14g carbs, 2g fiber, 10g sugar
- Orange: 47 cal, 1g protein, 0g fat, 12g carbs, 3g fiber, 9g sugar

FATS & OILS:
- Olive oil: 884 cal, 0g protein, 100g fat, 0g carbs, 0g fiber, 0g sugar
- Ghee: 900 cal, 0g protein, 100g fat, 0g carbs, 0g fiber, 0g sugar
- Butter: 717 cal, 1g protein, 81g fat, 0g carbs, 0g fiber, 0g sugar

LEGUMES:
- Chana dal (cooked): 126 cal, 8g protein, 2g fat, 22g carbs, 6g fiber, 1g sugar
- Rajma (cooked): 121 cal, 8g protein, 1g fat, 22g carbs, 7g fiber, 1g sugar
- Moong dal (cooked): 106 cal, 7g protein, 1g fat, 19g carbs, 3g fiber, 1g sugar

NUTS & SEEDS:
- Almonds: 579 cal, 21g protein, 50g fat, 22g carbs, 12g fiber, 4g sugar
- Peanut butter: 588 cal, 25g protein, 50g fat, 20g carbs, 6g fiber, 9g sugar

CRITICAL RULES:
1. ALWAYS use EXACT nutrition values from the database above - DO NOT estimate
2. Each food has ONE serving unit with realistic portion size
3. All nutrition values are PER 100g of the ingredient
4. Generate exactly 21 meals: 7 days × 3 meals (breakfast, lunch, dinner)
5. Keep meal names simple and descriptive

SERVING SIZE EXAMPLES:
- 1 Egg = 50g
- 1 Medium chapati/roti = 40g
- 1 Cup cooked rice = 200g
- 1 Bowl = 250g
- 2 Slices bread = 60g
- 1 Medium banana = 100g
- 1 Cup cooked dal = 200g
- 1 Plate mixed vegetables = 150g

JSON FORMAT:
{
  "meals": [
    {
      "day": "MONDAY",
      "type": "BREAKFAST",
      "mealName": "Simple meal name",
      "foods": [
        {
          "name": "Oats (cooked)",
          "calories": 71,
          "protein": 3,
          "fat": 3,
          "carbohydrate": 12,
          "fiber": 2,
          "sugar": 1,
          "servingLabel": "1 Bowl",
          "grams": 250
        }
      ]
    }
  ]
}

Generate 21 meals with EXACT nutrition values from the database above:`;

  // Call Gemini API
  const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    temperature: 0.3, // Lower temperature for more consistent output
  });

  // Parse the AI response
  let mealPlan;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Raw AI response:", text);
      throw new Error("No valid JSON found in AI response");
    }
    mealPlan = JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    console.log("Raw AI response:", text);
    throw new Error("Failed to parse meal plan. Please try again.");
  }

  // Validate mealPlan structure
  if (!mealPlan.meals || !Array.isArray(mealPlan.meals)) {
    throw new Error("Invalid meal plan structure from AI");
  }

  // Process and create meals
  for (const mealData of mealPlan.meals) {
    const foodIdMap: Record<string, number> = {};

    // Create all foods first
    // Create all foods first
    for (const foodItem of mealData.foods) {
      if (!foodItem.calories && foodItem.calories !== 0) {
        console.warn(`Skipping food ${foodItem.name} - missing calories`);
        continue;
      }

      const existingFood = await db.food.findFirst({
        where: {
          name: { equals: foodItem.name, mode: "insensitive" },
          userId: userId,
        },
      });

      if (existingFood) {
        foodIdMap[foodItem.name.toLowerCase()] = existingFood.id;
      } else {
        const newFood = await db.food.create({
          data: {
            name: foodItem.name,
            userId: userId,
            isPublic: false,
            calories: foodItem.calories ?? 0,
            protein: foodItem.protein ?? 0,
            fat: foodItem.fat ?? 0,
            carbohydrate: foodItem.carbohydrate ?? 0,
            fiber: foodItem.fiber ?? 0,
            sugar: foodItem.sugar ?? 0,
            description: null, // ← fix: no description on individual foods
          },
        });
        foodIdMap[foodItem.name.toLowerCase()] = newFood.id;

        const servingLabel = foodItem.servingLabel || "1 Serving";
        const grams = foodItem.grams || 100;
        const servingUnitId = await findOrCreateServingUnit(servingLabel);

        await db.foodServingUnit.create({
          data: {
            foodId: newFood.id,
            servingUnitId,
            grams: grams, // grams per this serving unit
          },
        });
      }
    }

    // Create the meal

    // Maps Day enum → getUTCDay() value (0=Sun, 1=Mon, 2=Tue, ...)
    const DAY_TO_WEEKDAY: Record<string, number> = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const [year, month, day] = startDate.split("-").map(Number);

    // Calculate relative offset from plan start day — immune to which weekday the plan starts on
    const planStartWeekday = new Date(
      Date.UTC(year, month - 1, day),
    ).getUTCDay();
    const mealWeekday = DAY_TO_WEEKDAY[mealData.day] ?? 0;
    const offset = (mealWeekday - planStartWeekday + 7) % 7;

    const meal = await db.meal.create({
      data: {
        userId: userId,
        // Date.UTC() avoids server local-timezone shifting the stored date
        dateTime: new Date(Date.UTC(year, month - 1, day + offset, 12, 0, 0)),
        type: mealData.type,
      },
    });

    // Create meal foods
    for (const foodItem of mealData.foods) {
      const foodId = foodIdMap[foodItem.name.toLowerCase()];
      if (!foodId) continue;

      const servingLabel = foodItem.servingLabel || "1 Serving";
      const servingUnitId = await findOrCreateServingUnit(servingLabel);

      await db.mealFood.create({
        data: {
          mealId: meal.id,
          foodId: foodId,
          servingUnitId: servingUnitId,
          amount: foodItem.grams || 100,
        },
      });
    }

    // Create meal plan item
    await db.mealPlanItem.create({
      data: {
        planId: plan.id,
        mealId: meal.id,
        day: mealData.day,
        type: mealData.type,
      },
    });
  }

  // Return the created plan
  const fullPlan = await getPlanById(plan.id, userId);
  if (!fullPlan) {
    throw new Error("Failed to load generated meal plan");
  }
  return fullPlan;
}
