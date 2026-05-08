"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Flame,
  MoreHorizontal,
  Plus,
  Wheat,
  Droplets,
  Beef,
} from "lucide-react";
import { useRemoveMeal } from "../_services/useMealPlanMutation";
import { MealFood, MealSlot, MealType } from "../_types/plannerTypes";
import MealDetailSheet from "./meal-detail-sheet";
import MealImageUpload from "./meal-image-upload";

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
  type: MealType;
  slot: MealSlot | undefined;
  onAdd: () => void;
};

export default function MealCard({ type, slot, onAdd }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const removeMutation = useRemoveMeal();

  const totalNutrition =
    slot?.meal?.mealFoods?.reduce(
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
    <>
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-0 sm:p-2 sm:pb-0">
          <div className="flex items-center gap-2">
            <span>{MEAL_ICONS[type]}</span>
            <span className="font-semibold">{MEAL_LABELS[type]}</span>
          </div>
          {slot && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onAdd}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => removeMutation.mutate(slot.id)}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 px-3 sm:px-3">
          {slot ? (
            <>
              <MealImageUpload planItemId={slot.id} currentImage={slot.image} />

              <div>
                <p className="font-medium">
                  {slot.meal?.mealFoods?.map((mf) => mf.food.name).join(", ")}
                </p>
                {slot.meal?.mealFoods?.[0]?.food?.description && (
                  // FIX: line-clamp-1 = single line with ellipsis.
                  // Full description is always accessible in the detail sheet.
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                    {slot.meal.mealFoods[0].food.description}
                  </p>
                )}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:flex sm:flex-wrap sm:gap-3 sm:text-sm">
                <span className="flex items-center gap-1">
                  <Flame className="size-3 shrink-0 text-orange-400" />
                  {Math.round(totalNutrition.calories)} kcal
                </span>
                <span className="flex items-center gap-1">
                  <Beef className="size-3 shrink-0 text-red-400" />
                  {Math.round(totalNutrition.protein)}g P
                </span>
                <span className="flex items-center gap-1">
                  <Wheat className="size-3 shrink-0 text-yellow-400" />
                  {Math.round(totalNutrition.carbs)}g C
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="size-3 shrink-0 text-blue-400" />
                  {Math.round(totalNutrition.fat)}g F
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setDetailOpen(true)}
              >
                View Details
              </Button>
            </>
          ) : (
            <button
              onClick={onAdd}
              className="border-muted-foreground/30 hover:border-primary hover:bg-primary/5 flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 transition-all"
            >
              <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                <Plus className="text-muted-foreground size-5" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Add {MEAL_LABELS[type]}
              </p>
            </button>
          )}
        </CardContent>
      </Card>

      {slot && (
        <MealDetailSheet
          open={detailOpen}
          slot={slot}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}
