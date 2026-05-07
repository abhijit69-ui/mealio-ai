"use client";

import { useQuery } from "@tanstack/react-query";
import { getMealsByDate } from "./mealQueries";

export const useMealsByDate = (userId: string, date: Date) => {
  return useQuery({
    queryKey: ["meals", userId, date.toDateString()],
    queryFn: () => getMealsByDate(userId, date),
    enabled: !!userId,
  });
};
