"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAssignMeal } from "../_services/useMealPlanMutation";
import { getFoods } from "@/app/(dashboard)/admin/(foods-management)/foods/_services/foodQueries";
import { foodFiltersDefaultValues } from "@/app/(dashboard)/admin/(foods-management)/foods/_types/foodFilterSchema";
import { Day, MealType, Prisma } from "$/generated/prisma/client";

type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: { foodServingUnits: { include: { servingUnit: true } } };
}>;

type FoodEntry = {
  foodId: number;
  foodName: string;
  servingUnitId: number;
  servingUnitName: string;
  amount: number;
};

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

type Props = {
  open: boolean;
  day: Day;
  type: MealType;
  planId: number;
  userId: string;
  onClose: () => void;
};

export default function AddMealDialog({
  open,
  day,
  type,
  planId,
  userId,
  onClose,
}: Props) {
  const [selectedFoods, setSelectedFoods] = useState<FoodEntry[]>([]);
  const assignMeal = useAssignMeal();

  const foodsQuery = useQuery({
    queryKey: ["foods-for-meal"],
    queryFn: () => getFoods({ ...foodFiltersDefaultValues, pageSize: 100 }),
  });

  const handleAddFood = (food: FoodWithServingUnits) => {
    const firstUnit = food.foodServingUnits?.[0];
    if (!firstUnit) return;

    // prevent duplicates
    if (selectedFoods.some((f) => f.foodId === food.id)) return;

    setSelectedFoods((prev) => [
      ...prev,
      {
        foodId: food.id,
        foodName: food.name,
        servingUnitId: firstUnit.servingUnitId,
        servingUnitName: firstUnit.servingUnit?.name ?? "serving",
        amount: 100,
      },
    ]);
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAmountChange = (index: number, delta: number) => {
    setSelectedFoods((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, amount: Math.max(1, f.amount + delta) } : f,
      ),
    );
  };

  const handleSave = () => {
    if (selectedFoods.length === 0) return;
    assignMeal.mutate(
      {
        planId,
        day,
        type,
        userId,
        mealFoods: selectedFoods.map((f) => ({
          foodId: f.foodId,
          servingUnitId: f.servingUnitId,
          amount: f.amount,
        })),
      },
      {
        onSuccess: () => {
          setSelectedFoods([]);
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setSelectedFoods([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add {MEAL_LABELS[type]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected foods */}
          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Foods</p>
              {selectedFoods.map((f, i) => (
                <div
                  key={f.foodId}
                  className="bg-muted flex items-center justify-between rounded-lg p-3"
                >
                  <span className="text-sm font-medium">{f.foodName}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => handleAmountChange(i, -10)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-16 text-center text-sm">
                      {f.amount}g
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => handleAmountChange(i, 10)}
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive size-7"
                      onClick={() => handleRemoveFood(i)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Food list */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Add Foods</p>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {foodsQuery.isLoading && (
                <p className="text-muted-foreground p-3 text-sm">
                  Loading foods...
                </p>
              )}
              {foodsQuery.data?.data.map((food) => {
                const isSelected = selectedFoods.some(
                  (f) => f.foodId === food.id,
                );
                return (
                  <button
                    key={food.id}
                    onClick={() => handleAddFood(food as FoodWithServingUnits)}
                    disabled={isSelected}
                    className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                      isSelected
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{food.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {food.calories ?? 0} kcal · {food.protein ?? 0}g P
                      </p>
                    </div>
                    <Plus className="text-muted-foreground size-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedFoods.length === 0 || assignMeal.isPending}
            isLoading={assignMeal.isPending}
          >
            Save Meal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
