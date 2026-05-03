import { z } from "zod";

export const mealPlanSchema = z.object({
  name: z.string().default("My Weekly Plan"),
  startDate: z.date(),
  endDate: z.date(),
});

export type MealPlanSchema = z.infer<typeof mealPlanSchema>;
