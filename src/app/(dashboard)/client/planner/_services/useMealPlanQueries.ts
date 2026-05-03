"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrCreateCurrentWeekPlan } from "./mealPlanMutation";

export const useMealPlan = (userId: string) => {
  return useQuery({
    queryKey: ["mealPlan", userId],
    queryFn: () => getOrCreateCurrentWeekPlan(userId),
    enabled: !!userId,
  });
};
