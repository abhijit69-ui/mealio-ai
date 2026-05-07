"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Beef, Droplets, Flame, Plus, Trash2, Wheat } from "lucide-react";
import {
  MealsByType,
  MealWithFoods,
  deleteMealFromDay,
} from "../_services/mealQueries";
import { MealType } from "$/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

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

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

type Props = {
  mealsByType: MealsByType;
  userId: string;
  date: Date;
};

export default function DayMealCards({ mealsByType, userId, date }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {MEAL_TYPES.map((type) => (
        <MealTypeCard
          key={type}
          type={type}
          meal={mealsByType[type]}
          userId={userId}
          date={date}
        />
      ))}
    </div>
  );
}

type MealTypeCardProps = {
  type: MealType;
  meal: MealWithFoods | null;
  userId: string;
  date: Date;
};

function MealTypeCard({ type, meal, userId, date }: MealTypeCardProps) {
  const [mealToDelete, setMealToDelete] = useState<number | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (mealId: number) => deleteMealFromDay(mealId),
    onSuccess: () => {
      toast.success("Meal removed");
      queryClient.invalidateQueries({
        queryKey: ["meals", userId, date.toDateString()],
      });
      router.refresh();
      setMealToDelete(null);
    },
    onError: () => toast.error("Failed to remove meal"),
  });

  const totalNutrition = meal?.mealFoods.reduce(
    (acc, mf) => ({
      calories: acc.calories + (mf.food.calories ?? 0) * (mf.amount / 100),
      protein: acc.protein + (mf.food.protein ?? 0) * (mf.amount / 100),
      carbs: acc.carbs + (mf.food.carbohydrate ?? 0) * (mf.amount / 100),
      fat: acc.fat + (mf.food.fat ?? 0) * (mf.amount / 100),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  ) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <span>{MEAL_ICONS[type]}</span>
            <span className="font-semibold">{MEAL_LABELS[type]}</span>
          </div>
          {meal && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-destructive size-8"
              onClick={() => setMealToDelete(meal.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
          {meal ? (
            <>
              {/* Food items */}
              <div className="space-y-2">
                {meal.mealFoods.map((mf) => {
                  const itemCalories =
                    (mf.food.calories ?? 0) * (mf.amount / 100);
                  return (
                    <div
                      key={mf.id}
                      className="bg-muted space-y-1 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {mf.food.name}
                          </p>
                          {mf.food.description && (
                            <p className="text-muted-foreground line-clamp-1 text-xs">
                              {mf.food.description}
                            </p>
                          )}
                        </div>
                        <span className="text-muted-foreground ml-2 shrink-0 text-xs">
                          {Math.round(itemCalories)} kcal
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {mf.amount}g · {mf.servingUnit?.name ?? "serving"}
                      </p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-red-400">
                          P:{" "}
                          {Math.round(
                            (mf.food.protein ?? 0) * (mf.amount / 100),
                          )}
                          g
                        </span>
                        <span className="text-yellow-400">
                          C:{" "}
                          {Math.round(
                            (mf.food.carbohydrate ?? 0) * (mf.amount / 100),
                          )}
                          g
                        </span>
                        <span className="text-blue-400">
                          F:{" "}
                          {Math.round((mf.food.fat ?? 0) * (mf.amount / 100))}g
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meal total nutrition */}
              <div className="mt-auto border-t pt-3">
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Flame className="size-3 text-orange-400" />
                    {Math.round(totalNutrition.calories)} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <Beef className="size-3 text-red-400" />
                    {Math.round(totalNutrition.protein)}g P
                  </span>
                  <span className="flex items-center gap-1">
                    <Wheat className="size-3 text-yellow-400" />
                    {Math.round(totalNutrition.carbs)}g C
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="size-3 text-blue-400" />
                    {Math.round(totalNutrition.fat)}g F
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
              <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                <Plus className="text-muted-foreground size-5" />
              </div>
              <p className="text-muted-foreground text-sm">
                No {MEAL_LABELS[type].toLowerCase()} logged
              </p>
              <p className="text-muted-foreground text-center text-xs">
                Add meals from the Planner
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!mealToDelete}
        onOpenChange={(o) => !o && setMealToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Meal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this{" "}
              {MEAL_LABELS[type].toLowerCase()}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMealToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                mealToDelete && deleteMutation.mutate(mealToDelete)
              }
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
