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

type NutritionStatProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBg: string;
};

// Reusable nutrition stat cell — icon badge + value + label stacked
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

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl px-0 pb-8"
      >
        {/*
          FIX: All content constrained to max-w-2xl and centered.
          On mobile this fills naturally; on desktop it won't stretch across 1440px.
        */}
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <SheetHeader className="mb-5">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <span>{MEAL_ICONS[slot.type]}</span>
              {MEAL_LABELS[slot.type]}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-5">
            {/* ── Total Nutrition ─────────────────────────────── */}
            <div className="bg-muted/60 rounded-2xl p-4 sm:p-5">
              <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                Total Nutrition
              </p>
              {/*
                FIX: 4 equal columns that stay compact.
                On desktop the max-w-2xl container keeps them close together.
              */}
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

            <Separator />

            {/* ── Per-food breakdown ──────────────────────────── */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Foods ({slot.meal.mealFoods.length})
              </p>

              {slot.meal.mealFoods.map((mf: MealFood) => {
                const foodCalories =
                  (mf.food.calories ?? 0) * (mf.amount / 100);
                const foodProtein = (mf.food.protein ?? 0) * (mf.amount / 100);
                const foodCarbs =
                  (mf.food.carbohydrate ?? 0) * (mf.amount / 100);
                const foodFat = (mf.food.fat ?? 0) * (mf.amount / 100);

                return (
                  <div
                    key={mf.id}
                    className="bg-card rounded-2xl border p-4 sm:p-5"
                  >
                    {/* Food header row */}
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{mf.food.name}</p>
                        {mf.food.description && (
                          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                            {mf.food.description}
                          </p>
                        )}
                      </div>
                      {/* Amount badge — right-aligned, won't compete with name */}
                      <div className="bg-muted shrink-0 rounded-lg px-2.5 py-1 text-right">
                        <p className="text-xs font-semibold">{mf.amount}g</p>
                        <p className="text-muted-foreground text-xs">
                          {mf.servingUnit?.name ?? "serving"}
                        </p>
                      </div>
                    </div>

                    {/*
                      FIX: Nutrition mini-grid inside the card.
                      Uses a subtle coloured left-border accent per macro
                      rather than big coloured blocks that visually dominate.
                    */}
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
      </SheetContent>
    </Sheet>
  );
}
