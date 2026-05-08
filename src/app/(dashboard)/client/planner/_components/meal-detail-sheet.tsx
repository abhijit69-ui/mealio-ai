"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MealFood, MealSlot, MealType } from "../_types/plannerTypes";
import {
  Beef,
  Check,
  Droplets,
  Flame,
  Info,
  Pencil,
  ScrollText,
  Wheat,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateFoodDescription } from "../_services/mealPlanMutation";
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
  const router = useRouter();
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  const hasImage = !!slot.image;
  // const foodsWithDescriptions = slot.meal.mealFoods.filter((mf: MealFood) =>
  //   mf.food.description?.trim(),
  // );

  const totalNutrition =
    slot.meal.mealFoods.reduce(
      (acc: typeof EMPTY_NUTRITION, mf: MealFood) => ({
        calories: acc.calories + (mf.food.calories ?? 0) * (mf.amount / 100),
        protein: acc.protein + (mf.food.protein ?? 0) * (mf.amount / 100),
        carbs: acc.carbs + (mf.food.carbohydrate ?? 0) * (mf.amount / 100),
        fat: acc.fat + (mf.food.fat ?? 0) * (mf.amount / 100),
      }),
      { ...EMPTY_NUTRITION },
    ) ?? EMPTY_NUTRITION;

  const descriptionMutation = useMutation({
    mutationFn: ({
      foodId,
      description,
    }: {
      foodId: number;
      description: string;
    }) => updateFoodDescription(foodId, description),
    onSuccess: () => {
      toast.success("Description updated");
      setEditingFoodId(null);
      router.refresh();
    },
    onError: () => toast.error("Failed to update description"),
  });

  const handleEditStart = (mf: MealFood) => {
    setEditingFoodId(mf.food.id);
    setEditingDescription(mf.food.description ?? "");
  };

  const handleEditSave = (foodId: number) => {
    descriptionMutation.mutate({ foodId, description: editingDescription });
  };

  const handleEditCancel = () => {
    setEditingFoodId(null);
    setEditingDescription("");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-0 pb-8"
      >
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <SheetHeader className="mb-5">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <span>{MEAL_ICONS[slot.type]}</span>
              {MEAL_LABELS[slot.type]}
            </SheetTitle>
          </SheetHeader>

          {/*
            LAYOUT:
            Mobile (1 col):  Nutrition → Image → Description → Foods
            Desktop no image (2 col): [Nutrition + Foods] | [Description]
            Desktop with image (3 col): [Nutrition + Foods] | [Image] | [Description]
          */}
          <div
            className={`grid grid-cols-1 gap-4 ${
              hasImage ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {/* ── Col 1: Nutrition + Foods ── */}
            <div className="order-1 flex flex-col gap-4">
              {/* Total Nutrition */}
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

              {/* Foods breakdown */}
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
                      className="bg-card space-y-3 rounded-2xl border p-4 sm:p-5"
                    >
                      {/* Food name + serving badge */}
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 flex-1 truncate font-medium">
                          {mf.food.name}
                        </p>
                        <div className="bg-muted shrink-0 rounded-lg px-2.5 py-1 text-right">
                          <p className="text-xs font-semibold">{mf.amount}g</p>
                          <p className="text-muted-foreground text-xs">
                            {mf.servingUnit?.name ?? "serving"}
                          </p>
                        </div>
                      </div>

                      {/* Per 100g note */}
                      <div className="flex items-start gap-1.5">
                        <Info className="text-muted-foreground mt-0.5 size-3 shrink-0" />
                        <p className="text-muted-foreground text-xs">
                          Nutrition values calculated based on per 100g. Your
                          serving: {mf.amount}g (
                          {mf.servingUnit?.name ?? "serving"}).
                        </p>
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

            {/* ── Col 2 (desktop): Image — only if exists ── */}
            {hasImage && (
              <div className="order-2 md:order-2">
                <div className="bg-muted/60 h-full min-h-75 overflow-hidden rounded-2xl">
                  <MealImageUpload
                    planItemId={slot.id}
                    currentImage={slot.image}
                    className="h-full min-h-75"
                    showButtonsAlways={true}
                  />
                </div>
              </div>
            )}

            {/* ── Col 3 (or 2 if no image): Description ── */}
            <div
              className={`order-3 ${hasImage ? "md:order-3" : "md:order-2"}`}
            >
              <div className="bg-muted/60 flex h-full flex-col rounded-2xl p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full">
                    <ScrollText className="text-primary size-3.5" />
                  </div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Description
                  </p>
                </div>

                {slot.meal.mealFoods.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {slot.meal.mealFoods.map((mf: MealFood, idx: number) => (
                      <div key={mf.id}>
                        {/* Food name + edit button */}
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {mf.food.name}
                          </p>
                          {editingFoodId !== mf.food.id && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="size-7 shrink-0"
                              onClick={() => handleEditStart(mf)}
                            >
                              <Pencil className="size-3" />
                            </Button>
                          )}
                        </div>

                        {/* Inline edit mode */}
                        {editingFoodId === mf.food.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingDescription}
                              onChange={(e) =>
                                setEditingDescription(e.target.value)
                              }
                              placeholder="Add a description for this food..."
                              className="min-h-25 text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                className="gap-1.5"
                                disabled={descriptionMutation.isPending}
                                onClick={() => handleEditSave(mf.food.id)}
                              >
                                <Check className="size-3" />
                                {descriptionMutation.isPending
                                  ? "Saving..."
                                  : "Save"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={handleEditCancel}
                              >
                                <X className="size-3" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : mf.food.description ? (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {mf.food.description}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEditStart(mf)}
                            className="text-muted-foreground hover:text-primary text-sm underline-offset-4 transition-colors hover:underline"
                          >
                            + Add description
                          </button>
                        )}

                        {idx < slot.meal.mealFoods.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                      <ScrollText className="text-muted-foreground size-4" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      No foods in this meal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
