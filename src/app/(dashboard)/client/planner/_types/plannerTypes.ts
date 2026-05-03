import { Day, MealType } from "$/generated/prisma/client";

export type { Day, MealType };

export type MealFood = {
  id: number;
  foodId: number;
  mealId: number;
  servingUnitId: number;
  amount: number;
  food: {
    id: number;
    name: string;
    image: string | null;
    description: string | null;
    calories: number | null;
    protein: number | null;
    fat: number | null;
    carbohydrate: number | null;
    fiber: number | null;
    sugar: number | null;
  };
  servingUnit: {
    id: number;
    name: string;
  };
};

export type MealSlot = {
  id: number;
  planId: number;
  mealId: number;
  day: Day;
  type: MealType;
  meal: {
    id: number;
    type: MealType;
    dateTime: Date;
    mealFoods: MealFood[];
  };
};

export type MealPlanWithItems = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  items: MealSlot[];
};
