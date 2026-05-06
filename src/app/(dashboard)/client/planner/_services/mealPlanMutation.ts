"use server";

import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { addDays, startOfWeek, endOfWeek } from "date-fns";
import { Day, MealType } from "$/generated/prisma/client";

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
  return await db.mealPlan.create({
    data: { userId, name, startDate, endDate },
  });
};

export const deletePlan = async (planId: number) => {
  await executeAction({
    actionFn: async () => {
      // cascade handles MealPlanItems → Meals → MealFoods automatically
      await db.mealPlan.delete({ where: { id: planId } });
    },
  });
};

// finds existing serving unit by name or creates a new one
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
    servingUnitName?: string; // ← used for personal foods with no unit yet
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
          // resolve servingUnitId — if 0, find or create by name
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
      description: description || null, // ← add
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

  return food;
};
