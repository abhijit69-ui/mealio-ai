"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MealFood, MealSlot, MealType } from "../_types/plannerTypes";
import { Beef, Droplets, Flame, Wheat } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MEAL_ICONS: Record<MealType, string> = {
  BREAKFAST: "🌤️",
  LUNCH: "☀️",
  DINNER: "🌙",
};

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

const EMPTY_NUTRITION = { calories: 0, protein: 0, carbs: 0, fat: 0 };

type Props = {
  open: boolean;
  slot: MealSlot;
  onClose: () => void;
};

export default function MealDetailSheet({ open, slot, onClose }: Props) {
  const totalNutrition =
    slot.meal.mealFoods.reduce(
      (
        acc: { calories: number; protein: number; carbs: number; fat: number },
        mf: MealFood,
      ) => ({
        calories: acc.calories + (mf.food.calories ?? 0) * (mf.amount / 100),
        protein: acc.protein + (mf.food.protein ?? 0) * (mf.amount / 100),
        carbs: acc.carbs + (mf.food.carbohydrate ?? 0) * (mf.amount / 100),
        fat: acc.fat + (mf.food.fat ?? 0) * (mf.amount / 100),
      }),
      { ...EMPTY_NUTRITION },
    ) ?? EMPTY_NUTRITION;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <span>{MEAL_ICONS[slot.type]}</span>
            {MEAL_LABELS[slot.type]}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Total nutrition summary */}
          <div className="bg-muted rounded-xl p-4">
            <p className="mb-3 text-sm font-medium">Total Nutrition</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <Flame className="size-4 text-orange-400" />
                </div>
                <p className="text-lg font-bold">
                  {Math.round(totalNutrition.calories)}
                </p>
                <p className="text-muted-foreground text-xs">kcal</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <Beef className="size-4 text-red-400" />
                </div>
                <p className="text-lg font-bold">
                  {Math.round(totalNutrition.protein)}g
                </p>
                <p className="text-muted-foreground text-xs">Protein</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <Wheat className="size-4 text-yellow-400" />
                </div>
                <p className="text-lg font-bold">
                  {Math.round(totalNutrition.carbs)}g
                </p>
                <p className="text-muted-foreground text-xs">Carbs</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <Droplets className="size-4 text-blue-400" />
                </div>
                <p className="text-lg font-bold">
                  {Math.round(totalNutrition.fat)}g
                </p>
                <p className="text-muted-foreground text-xs">Fat</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Per food breakdown */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Foods ({slot.meal.mealFoods.length})
            </p>
            {slot.meal.mealFoods.map((mf: MealFood) => {
              const foodCalories = (mf.food.calories ?? 0) * (mf.amount / 100);
              const foodProtein = (mf.food.protein ?? 0) * (mf.amount / 100);
              const foodCarbs = (mf.food.carbohydrate ?? 0) * (mf.amount / 100);
              const foodFat = (mf.food.fat ?? 0) * (mf.amount / 100);

              return (
                <div
                  key={mf.id}
                  className="bg-card space-y-3 rounded-xl border p-4"
                >
                  {/* Food header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{mf.food.name}</p>
                      {mf.food.description && (
                        <p className="text-muted-foreground mt-0.5 text-sm">
                          {mf.food.description}
                        </p>
                      )}
                    </div>
                    <div className="text-muted-foreground text-right text-sm">
                      <p>{mf.amount}g</p>
                      <p className="text-xs">
                        {mf.servingUnit?.name ?? "serving"}
                      </p>
                    </div>
                  </div>

                  {/* Per food nutrition */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-muted rounded-lg p-2 text-center">
                      <p className="text-xs font-semibold">
                        {Math.round(foodCalories)}
                      </p>
                      <p className="text-muted-foreground text-xs">kcal</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2 text-center">
                      <p className="text-xs font-semibold">
                        {Math.round(foodProtein)}g
                      </p>
                      <p className="text-muted-foreground text-xs">P</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2 text-center">
                      <p className="text-xs font-semibold">
                        {Math.round(foodCarbs)}g
                      </p>
                      <p className="text-muted-foreground text-xs">C</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2 text-center">
                      <p className="text-xs font-semibold">
                        {Math.round(foodFat)}g
                      </p>
                      <p className="text-muted-foreground text-xs">F</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
