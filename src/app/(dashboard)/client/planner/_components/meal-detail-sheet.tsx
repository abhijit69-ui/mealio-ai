"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MealFood, MealSlot, MealType } from "../_types/plannerTypes";
import { Beef, Droplets, Flame, ScrollText, Wheat } from "lucide-react";
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

type NutritionStatProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBg: string;
};

function NutritionStat({ icon, value, label, iconBg }: NutritionStatProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex size-8 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <p className="text-base font-bold sm:text-lg">{value}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

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

  // Only foods that actually have a description
  const foodsWithDescriptions = slot.meal.mealFoods.filter((mf: MealFood) =>
    mf.food.description?.trim(),
  );

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl px-0 pb-8"
      >
        {/* Wider max-w so the bento grid has room to breathe on desktop */}
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <SheetHeader className="mb-5">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <span>{MEAL_ICONS[slot.type]}</span>
              {MEAL_LABELS[slot.type]}
            </SheetTitle>
          </SheetHeader>

          {/*
            BENTO GRID
            ══════════════════════════════════════════════════════
            Mobile  (1 col)  DOM order → Nutrition · Description · Foods
            Desktop (2 cols) Explicit placement:
              col-1 row-1 → Nutrition
              col-1 row-2 → Foods
              col-2 row-1…2 (row-span-2) → Description
          */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* ① Total Nutrition ─ col-1 row-1 on desktop */}
            <div className="order-1 md:col-start-1 md:row-start-1">
              <div className="bg-muted/60 rounded-2xl p-4 sm:p-5">
                <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                  Total Nutrition
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <NutritionStat
                    icon={<Flame className="size-3.5 text-orange-400" />}
                    iconBg="bg-orange-400/10"
                    value={`${Math.round(totalNutrition.calories)}`}
                    label="kcal"
                  />
                  <NutritionStat
                    icon={<Beef className="size-3.5 text-red-400" />}
                    iconBg="bg-red-400/10"
                    value={`${Math.round(totalNutrition.protein)}g`}
                    label="Protein"
                  />
                  <NutritionStat
                    icon={<Wheat className="size-3.5 text-yellow-400" />}
                    iconBg="bg-yellow-400/10"
                    value={`${Math.round(totalNutrition.carbs)}g`}
                    label="Carbs"
                  />
                  <NutritionStat
                    icon={<Droplets className="size-3.5 text-blue-400" />}
                    iconBg="bg-blue-400/10"
                    value={`${Math.round(totalNutrition.fat)}g`}
                    label="Fat"
                  />
                </div>
              </div>
            </div>

            {/*
              ② Description ─ col-2 row-1…2 on desktop (spans both rows)
                              order-2 on mobile (between Nutrition and Foods)
            */}
            <div className="order-2 md:col-start-2 md:row-span-2 md:row-start-1">
              <div className="bg-muted/60 flex h-full flex-col rounded-2xl p-4 sm:p-5">
                {/* Header */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full">
                    <ScrollText className="text-primary size-3.5" />
                  </div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Description
                  </p>
                </div>

                {foodsWithDescriptions.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {foodsWithDescriptions.map((mf: MealFood, idx: number) => (
                      <div key={mf.id}>
                        <p className="mb-1.5 text-sm font-semibold">
                          {mf.food.name}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {mf.food.description}
                        </p>
                        {idx < foodsWithDescriptions.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                      <ScrollText className="text-muted-foreground size-4" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      No description available for this meal.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ③ Foods breakdown ─ col-1 row-2 on desktop */}
            <div className="order-3 md:col-start-1 md:row-start-2">
              <div className="space-y-3">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Foods ({slot.meal.mealFoods.length})
                </p>

                {slot.meal.mealFoods.map((mf: MealFood) => {
                  const foodCalories =
                    (mf.food.calories ?? 0) * (mf.amount / 100);
                  const foodProtein =
                    (mf.food.protein ?? 0) * (mf.amount / 100);
                  const foodCarbs =
                    (mf.food.carbohydrate ?? 0) * (mf.amount / 100);
                  const foodFat = (mf.food.fat ?? 0) * (mf.amount / 100);

                  return (
                    <div
                      key={mf.id}
                      className="bg-card rounded-2xl border p-4 sm:p-5"
                    >
                      {/* Food name + amount badge */}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{mf.food.name}</p>
                        </div>
                        <div className="bg-muted shrink-0 rounded-lg px-2.5 py-1 text-right">
                          <p className="text-xs font-semibold">{mf.amount}g</p>
                          <p className="text-muted-foreground text-xs">
                            {mf.servingUnit?.name ?? "serving"}
                          </p>
                        </div>
                      </div>

                      {/* Per-food nutrition mini-grid */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-muted/50 rounded-xl border-l-2 border-orange-400/60 p-2 text-center">
                          <p className="text-xs font-semibold">
                            {Math.round(foodCalories)}
                          </p>
                          <p className="text-muted-foreground text-xs">kcal</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl border-l-2 border-red-400/60 p-2 text-center">
                          <p className="text-xs font-semibold">
                            {Math.round(foodProtein)}g
                          </p>
                          <p className="text-muted-foreground text-xs">P</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl border-l-2 border-yellow-400/60 p-2 text-center">
                          <p className="text-xs font-semibold">
                            {Math.round(foodCarbs)}g
                          </p>
                          <p className="text-muted-foreground text-xs">C</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl border-l-2 border-blue-400/60 p-2 text-center">
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
