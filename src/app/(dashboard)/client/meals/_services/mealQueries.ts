"use server";

import db from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { MealType, Prisma } from "$/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { executeAction } from "@/lib/executeAction";

export type MealWithFoods = Prisma.MealGetPayload<{
  include: {
    mealFoods: {
      include: {
        food: true;
        servingUnit: true;
      };
    };
  };
}>;

export type MealsByType = {
  BREAKFAST: MealWithFoods | null;
  LUNCH: MealWithFoods | null;
  DINNER: MealWithFoods | null;
};

export type DayNutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  totalMeals: number;
  totalFoodItems: number;
};

export const getMealsByDate = async (
  userId: string,
  date: Date,
): Promise<{
  mealsByType: MealsByType;
  nutrition: DayNutrition;
  planId: number | null;
}> => {
  const meals = await db.meal.findMany({
    where: {
      userId,
      dateTime: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    include: {
      mealFoods: {
        include: {
          food: true,
          servingUnit: true,
        },
      },
    },
    orderBy: { dateTime: "asc" },
  });

  // group by meal type
  const mealsByType: MealsByType = {
    BREAKFAST: meals.find((m) => m.type === "BREAKFAST") ?? null,
    LUNCH: meals.find((m) => m.type === "LUNCH") ?? null,
    DINNER: meals.find((m) => m.type === "DINNER") ?? null,
  };

  // calculate total nutrition
  const nutrition: DayNutrition = meals.reduce(
    (dayAcc, meal) => {
      const mealNutrition = meal.mealFoods.reduce(
        (mealAcc, mf) => ({
          calories:
            mealAcc.calories + (mf.food.calories ?? 0) * (mf.amount / 100),
          protein: mealAcc.protein + (mf.food.protein ?? 0) * (mf.amount / 100),
          carbs:
            mealAcc.carbs + (mf.food.carbohydrate ?? 0) * (mf.amount / 100),
          fat: mealAcc.fat + (mf.food.fat ?? 0) * (mf.amount / 100),
          fiber: mealAcc.fiber + (mf.food.fiber ?? 0) * (mf.amount / 100),
          sugar: mealAcc.sugar + (mf.food.sugar ?? 0) * (mf.amount / 100),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
      );
      return {
        calories: dayAcc.calories + mealNutrition.calories,
        protein: dayAcc.protein + mealNutrition.protein,
        carbs: dayAcc.carbs + mealNutrition.carbs,
        fat: dayAcc.fat + mealNutrition.fat,
        fiber: dayAcc.fiber + mealNutrition.fiber,
        sugar: dayAcc.sugar + mealNutrition.sugar,
        totalMeals: dayAcc.totalMeals + 1,
        totalFoodItems: dayAcc.totalFoodItems + meal.mealFoods.length,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      totalMeals: 0,
      totalFoodItems: 0,
    },
  );

  const plan = await db.mealPlan.findFirst({
    where: {
      userId,
      startDate: { lte: endOfDay(date) },
      endDate: { gte: startOfDay(date) },
    },
    select: { id: true },
  });

  return { mealsByType, nutrition, planId: plan?.id ?? null };
};

export const deleteMealFromDay = async (mealId: number) => {
  await executeAction({
    actionFn: async () => {
      await db.mealFood.deleteMany({ where: { mealId } });
      await db.meal.delete({ where: { id: mealId } });
      revalidatePath("/client/meals");
    },
  });
};
