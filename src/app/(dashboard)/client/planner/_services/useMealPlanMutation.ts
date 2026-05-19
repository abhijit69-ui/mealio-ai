"use client";

import { useMutation } from "@tanstack/react-query";
import {
  assignMealToPlanSlot,
  createPlan,
  deletePlan,
  removeMealFromSlot,
  updateMealPlanItemImage,
} from "./mealPlanMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Day, MealType } from "../_types/plannerTypes";
import { GeneratePlanWithAIInputSchema } from "../_types/aiMealPlanSchema";

export const useCreatePlan = (userId: string) => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { name: string; startDate: Date }) =>
      createPlan({ ...data, userId }),
    onSuccess: (plan) => {
      toast.success("Plan created");
      router.push(`/client/planner/${plan.id}`);
    },
    onError: () => toast.error("Failed to create plan"),
  });
};

export const useDeletePlan = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (planId: number) => deletePlan(planId),
    onSuccess: () => {
      toast.success("Plan deleted");
      router.refresh(); // ← replaces invalidateQueries — re-runs server component
    },
    onError: () => toast.error("Failed to delete plan"),
  });
};

export const useAssignMeal = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: {
      planId: number;
      day: Day;
      type: MealType;
      userId: string;
      mealFoods: {
        foodId: number;
        servingUnitId: number;
        servingUnitName?: string;
        amount: number;
      }[];
    }) => assignMealToPlanSlot(data),
    onSuccess: () => {
      toast.success("Meal saved");
      router.refresh(); // ← re-runs server component with fresh data
    },
    onError: () => toast.error("Failed to save meal"),
  });
};

export const useRemoveMeal = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (planItemId: number) => removeMealFromSlot(planItemId),
    onSuccess: () => {
      toast.success("Meal removed");
      router.refresh(); // ← re-runs server component with fresh data
    },
    onError: () => toast.error("Failed to remove meal"),
  });
};

export const useUpdateMealImage = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      planItemId,
      imageUrl,
    }: {
      planItemId: number;
      imageUrl: string | null;
    }) => updateMealPlanItemImage(planItemId, imageUrl),
    onSuccess: () => {
      router.refresh();
    },
    onError: () => toast.error("Failed to update image"),
  });
};

// AI generation mutation

export const useGeneratePlanWithAI = (userId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      startDate: string;
      goal:
        | "weight_loss"
        | "muscle_gain"
        | "maintenance"
        | "high_protein"
        | "energy_boost"
        | "healthy_eating";
      availableIngredients?: string;
      foodsToAvoid?: string;
      dietaryRestrictions?: (
        | "vegetarian"
        | "vegan"
        | "non_vegetarian"
        | "lactose_free"
        | "gluten_free"
      )[];
      budget?: "budget" | "moderate" | "premium";
    }) => {
      // Validate with Zod
      const validated = GeneratePlanWithAIInputSchema.parse({
        ...data,
        userId,
      });

      // Import dynamically to avoid circular dependencies
      const { generateMealPlanWithAI } = await import("./mealPlanMutation");
      return generateMealPlanWithAI(validated);
    },
    onSuccess: (plan) => {
      toast.success("AI generated your meal plan!");
      router.push(`/client/planner/${plan.id}`);
    },
    onError: (error) => {
      console.error("AI Generation Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate meal plan",
      );
    },
  });
};
