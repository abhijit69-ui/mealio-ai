"use server";

import { executeAction } from "@/lib/executeAction";
import { foodSchema, FoodSchema } from "../_types/foodSchema";
import db from "@/lib/db";
import { toNumberSafe } from "@/lib/utils";

export const createFood = async (data: FoodSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);

      const food = await db.food.create({
        data: {
          name: validatedData.name,
          calories: toNumberSafe(validatedData.calories),
          carbohydrate: toNumberSafe(validatedData.carbohydrate),
          fat: toNumberSafe(validatedData.fat),
          fiber: toNumberSafe(validatedData.fiber),
          sugar: toNumberSafe(validatedData.sugar),
          protein: toNumberSafe(validatedData.protein),
          categoryId: toNumberSafe(validatedData.categoryId) || null,
          isPublic: true, // ← admin foods are always global
          userId: null, // ← no owner, belongs to everyone
        },
      });

      await Promise.all(
        validatedData.foodServingUnits.map(async (unit) => {
          await db.foodServingUnit.create({
            data: {
              foodId: food.id,
              servingUnitId: toNumberSafe(unit.foodServingUnitId),
              grams: toNumberSafe(unit.grams),
            },
          });
        }),
      );
    },
  });
};

export const updateFood = async (data: FoodSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);
      if (validatedData.action === "update") {
        await db.food.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            calories: toNumberSafe(validatedData.calories),
            carbohydrate: toNumberSafe(validatedData.carbohydrate),
            fat: toNumberSafe(validatedData.fat),
            fiber: toNumberSafe(validatedData.fiber),
            sugar: toNumberSafe(validatedData.sugar),
            protein: toNumberSafe(validatedData.protein),
            categoryId: toNumberSafe(validatedData.categoryId) || null,
          },
        });

        await db.foodServingUnit.deleteMany({
          where: { foodId: validatedData.id },
        });

        await Promise.all(
          validatedData.foodServingUnits.map(async (unit) => {
            await db.foodServingUnit.create({
              data: {
                foodId: validatedData.id,
                servingUnitId: toNumberSafe(unit.foodServingUnitId),
                grams: toNumberSafe(unit.grams),
              },
            });
          }),
        );
      }
    },
  });
};

export const deleteFood = async (id: number) => {
  await executeAction({
    actionFn: async () => {
      await db.foodServingUnit.deleteMany({
        where: { foodId: id },
      });
      await db.food.delete({ where: { id } });
    },
  });
};
