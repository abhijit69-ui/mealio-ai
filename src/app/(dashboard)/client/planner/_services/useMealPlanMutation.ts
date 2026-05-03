"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignMealToPlanSlot,
  createPlan,
  deletePlan,
  removeMealFromSlot,
} from "./mealPlanMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => deletePlan(planId),
    onSuccess: () => {
      toast.success("Plan deleted");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => toast.error("Failed to delete plan"),
  });
};

export const useAssignMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignMealToPlanSlot,
    onSuccess: () => {
      toast.success("Meal saved");
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
    onError: () => toast.error("Failed to save meal"),
  });
};

export const useRemoveMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planItemId: number) => removeMealFromSlot(planItemId),
    onSuccess: () => {
      toast.success("Meal removed");
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
    onError: () => toast.error("Failed to remove meal"),
  });
};
