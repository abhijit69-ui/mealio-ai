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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useAssignMeal } from "../_services/useMealPlanMutation";
import { getFoodsForMeal } from "@/app/(dashboard)/admin/(foods-management)/foods/_services/foodQueries";
import { Day, MealType, Prisma } from "$/generated/prisma/client";
import {
  createPersonalFood,
  ServingUnitEntry,
} from "../_services/mealPlanMutation";
import { toast } from "sonner";

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

type CustomFoodForm = {
  name: string;
  calories: string;
  protein: string;
  carbohydrate: string;
  fat: string;
};

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

const DEFAULT_CUSTOM_FOOD: CustomFoodForm = {
  name: "",
  calories: "",
  protein: "",
  carbohydrate: "",
  fat: "",
};

const DEFAULT_SERVING_UNIT: ServingUnitEntry = { name: "", grams: 100 };

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFood, setCustomFood] =
    useState<CustomFoodForm>(DEFAULT_CUSTOM_FOOD);
  const [servingUnits, setServingUnits] = useState<ServingUnitEntry[]>([
    { ...DEFAULT_SERVING_UNIT },
  ]);

  const assignMeal = useAssignMeal();
  const queryClient = useQueryClient();

  const foodsQuery = useQuery({
    queryKey: ["foods-for-meal", userId, searchTerm],
    queryFn: () => getFoodsForMeal(userId, searchTerm || undefined),
    enabled: open,
  });

  const createFoodMutation = useMutation({
    mutationFn: () =>
      createPersonalFood({ ...customFood, userId, servingUnits }),
    onSuccess: (food) => {
      toast.success("Personal food created");
      queryClient.invalidateQueries({ queryKey: ["foods-for-meal"] });
      const firstUnit = servingUnits[0];
      setSelectedFoods((prev) => [
        ...prev,
        {
          foodId: food.id, // ← properly typed now
          foodName: food.name,
          servingUnitId: 0,
          servingUnitName: firstUnit?.name || "serving",
          amount: firstUnit?.grams ?? 100,
        },
      ]);
      setCustomFood(DEFAULT_CUSTOM_FOOD);
      setServingUnits([{ ...DEFAULT_SERVING_UNIT }]);
      setShowCustomForm(false);
    },
    onError: () => toast.error("Failed to create food"),
  });

  const handleAddFood = (food: FoodWithServingUnits) => {
    if (selectedFoods.some((f) => f.foodId === food.id)) return;
    const firstUnit = food.foodServingUnits?.[0];
    setSelectedFoods((prev) => [
      ...prev,
      {
        foodId: food.id,
        foodName: food.name,
        servingUnitId: firstUnit?.servingUnitId ?? 0,
        servingUnitName: firstUnit?.servingUnit?.name ?? "serving",
        amount: firstUnit?.grams ?? 100,
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

  const handleAddServingUnitRow = () => {
    setServingUnits((prev) => [...prev, { ...DEFAULT_SERVING_UNIT }]);
  };

  const handleRemoveServingUnitRow = (index: number) => {
    setServingUnits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServingUnitChange = (
    index: number,
    field: keyof ServingUnitEntry,
    value: string | number,
  ) => {
    setServingUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u)),
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
          servingUnitName: f.servingUnitName,
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
    setSearchTerm("");
    setShowCustomForm(false);
    setCustomFood(DEFAULT_CUSTOM_FOOD);
    setServingUnits([{ ...DEFAULT_SERVING_UNIT }]);
    onClose();
  };

  const isCustomFormValid =
    customFood.name.trim() &&
    servingUnits.every((u) => u.name.trim() && u.grams > 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
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
                  <div>
                    <p className="text-sm font-medium">{f.foodName}</p>
                    <p className="text-muted-foreground text-xs">
                      {f.servingUnitName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => handleAmountChange(i, -10)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-14 text-center text-sm">
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

          {/* Add foods section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Add Foods</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary h-7 text-xs"
                onClick={() => setShowCustomForm((v) => !v)}
              >
                {showCustomForm ? (
                  <>
                    <ChevronUp className="mr-1 size-3" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 size-3" />
                    Create personal food
                  </>
                )}
              </Button>
            </div>

            {/* Personal food creation form */}
            {showCustomForm && (
              <div className="bg-muted/50 space-y-3 rounded-lg border p-3">
                <p className="text-sm font-medium">New Personal Food</p>

                {/* Nutrition fields */}
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name *</Label>
                    <Input
                      placeholder="e.g. Homemade Oatmeal"
                      value={customFood.name}
                      onChange={(e) =>
                        setCustomFood((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Calories (kcal)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={customFood.calories}
                        onChange={(e) =>
                          setCustomFood((p) => ({
                            ...p,
                            calories: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Protein (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={customFood.protein}
                        onChange={(e) =>
                          setCustomFood((p) => ({
                            ...p,
                            protein: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Carbohydrates (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={customFood.carbohydrate}
                        onChange={(e) =>
                          setCustomFood((p) => ({
                            ...p,
                            carbohydrate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Fat (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={customFood.fat}
                        onChange={(e) =>
                          setCustomFood((p) => ({
                            ...p,
                            fat: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Serving units */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Serving Units</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={handleAddServingUnitRow}
                    >
                      <Plus className="mr-1 size-3" />
                      Add unit
                    </Button>
                  </div>
                  {servingUnits.map((unit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. 1 Bowl"
                        value={unit.name}
                        className="flex-1"
                        onChange={(e) =>
                          handleServingUnitChange(i, "name", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="grams"
                        value={unit.grams || ""}
                        className="w-24"
                        onChange={(e) =>
                          handleServingUnitChange(
                            i,
                            "grams",
                            Number(e.target.value),
                          )
                        }
                      />
                      <span className="text-muted-foreground text-xs">g</span>
                      {servingUnits.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive size-7 shrink-0"
                          onClick={() => handleRemoveServingUnitRow(i)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  disabled={!isCustomFormValid || createFoodMutation.isPending}
                  isLoading={createFoodMutation.isPending}
                  onClick={() => createFoodMutation.mutate()}
                >
                  Save Personal Food
                </Button>
              </div>
            )}

            {/* Search */}
            <Input
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Food list */}
            <div className="max-h-52 space-y-1 overflow-y-auto">
              {foodsQuery.isLoading && (
                <p className="text-muted-foreground p-3 text-sm">
                  Loading foods...
                </p>
              )}
              {!foodsQuery.isLoading && foodsQuery.data?.length === 0 && (
                <p className="text-muted-foreground p-3 text-sm">
                  No foods found. Create a personal food above.
                </p>
              )}
              {foodsQuery.data?.map((food) => {
                const isSelected = selectedFoods.some(
                  (f) => f.foodId === food.id,
                );
                const isPersonal = food.userId !== null;
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{food.name}</p>
                        {isPersonal && (
                          <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs">
                            Personal
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {food.calories ?? 0} kcal · {food.protein ?? 0}g P ·{" "}
                        {food.carbohydrate ?? 0}g C · {food.fat ?? 0}g F
                      </p>
                    </div>
                    <Plus className="text-muted-foreground size-4 shrink-0" />
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
