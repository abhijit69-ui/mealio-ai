import { z } from "zod";

export const GeneratePlanWithAIInputSchema = z.object({
  userId: z.string(),
  name: z.string().optional(),
  startDate: z.string(),
  goal: z.enum([
    "weight_loss",
    "muscle_gain",
    "maintenance",
    "high_protein",
    "energy_boost",
    "healthy_eating",
  ]),
  availableIngredients: z.string().optional(),
  foodsToAvoid: z.string().optional(),
  dietaryRestrictions: z
    .array(
      z.enum([
        "vegetarian",
        "vegan",
        "non_vegetarian",
        "lactose_free",
        "gluten_free",
      ]),
    )
    .optional(),
  budget: z.enum(["budget", "moderate", "premium"]).optional(),
});

export type GeneratePlanWithAIInput = z.infer<
  typeof GeneratePlanWithAIInputSchema
>;
