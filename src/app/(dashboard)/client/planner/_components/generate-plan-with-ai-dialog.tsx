"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { useGeneratePlanWithAI } from "../_services/useMealPlanMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Form schema
const formSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  goal: z.enum(
    [
      "weight_loss",
      "muscle_gain",
      "maintenance",
      "high_protein",
      "energy_boost",
      "healthy_eating",
    ],
    { required_error: "Please select a goal" },
  ),
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

type FormData = z.infer<typeof formSchema>;
type DietaryRestriction = NonNullable<FormData["dietaryRestrictions"]>[number];

// Options
const goalOptions = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "maintenance", label: "Maintenance" },
  { value: "high_protein", label: "High Protein" },
  { value: "energy_boost", label: "Energy Boost" },
  { value: "healthy_eating", label: "Healthy Eating" },
];

const dietaryOptions: { value: DietaryRestriction; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "non_vegetarian", label: "Non-Vegetarian" },
  { value: "lactose_free", label: "Lactose Free" },
  { value: "gluten_free", label: "Gluten Free" },
];

const budgetOptions = [
  { value: "budget", label: "Budget" },
  { value: "moderate", label: "Moderate" },
  { value: "premium", label: "Premium" },
];

type Props = { open: boolean; userId: string; onClose: () => void };

export default function GeneratePlanWithAIDialog({
  open,
  userId,
  onClose,
}: Props) {
  const router = useRouter();
  const [selectedDietary, setSelectedDietary] = useState<DietaryRestriction[]>(
    [],
  );

  const generatePlan = useGeneratePlanWithAI(userId);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const startDate = watch("startDate");
  const endDate = startDate
    ? format(addDays(new Date(startDate), 6), "MMM d, yyyy")
    : "";

  const handleDietaryToggle = (value: DietaryRestriction) => {
    const next = selectedDietary.includes(value)
      ? selectedDietary.filter((v) => v !== value)
      : [...selectedDietary, value];
    setSelectedDietary(next);
    setValue("dietaryRestrictions", next.length > 0 ? next : undefined);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await generatePlan.mutateAsync({
        name: data.name,
        startDate: data.startDate,
        goal: data.goal,
        availableIngredients: data.availableIngredients || undefined,
        foodsToAvoid: data.foodsToAvoid || undefined,
        dietaryRestrictions:
          selectedDietary.length > 0 ? selectedDietary : undefined,
        budget: data.budget,
      });

      toast.success("AI generated your meal plan!");
      reset();
      onClose();
      router.push(`/client/planner/${result.id}`);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate meal plan",
      );
    }
  };

  const handleClose = () => {
    reset();
    setSelectedDietary([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            Generate Meal Plan with AI
          </DialogTitle>
          <DialogDescription>
            Let AI create a personalized 7-day meal plan based on your goals and
            preferences.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Plan Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Summer Cut Week 1"
                    {...register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    {...register("startDate")}
                  />
                  {startDate && (
                    <p className="text-muted-foreground text-xs">
                      Plan ends on {endDate} (7 days)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Goal (Required) */}
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Goal <span className="text-destructive">*</span>
              </h3>

              <ControlledSelect<FormData>
                name="goal"
                label=""
                placeholder="Select your primary goal"
                options={goalOptions}
              />
              {errors.goal && (
                <p className="text-destructive text-sm">
                  {errors.goal.message}
                </p>
              )}
            </div>

            {/* Section 3: Available Ingredients */}
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Available Ingredients (Optional)
              </h3>

              <div className="space-y-2">
                <Label htmlFor="availableIngredients">
                  What ingredients do you have?
                </Label>
                <Input
                  id="availableIngredients"
                  placeholder="e.g. rice, eggs, potatoes, onions, chicken, oats"
                  {...register("availableIngredients")}
                />
                <p className="text-muted-foreground text-xs">
                  AI will incorporate these ingredients where possible. Separate
                  with commas.
                </p>
              </div>
            </div>

            {/* Section 4: Dietary Restrictions */}
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Dietary Restrictions (Optional)
              </h3>

              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={
                      selectedDietary.includes(option.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleDietaryToggle(option.value)}
                    className="h-8"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Section 5: Foods to Avoid */}
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Foods to Avoid (Optional)
              </h3>

              <div className="space-y-2">
                <Label htmlFor="foodsToAvoid">
                  Any foods you want to exclude?
                </Label>
                <Input
                  id="foodsToAvoid"
                  placeholder="e.g. pork, seafood, mushrooms"
                  {...register("foodsToAvoid")}
                />
                <p className="text-muted-foreground text-xs">
                  Separate with commas.
                </p>
              </div>
            </div>

            {/* Section 6: Budget */}
            <div className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Budget Preference (Optional)
              </h3>

              <ControlledSelect<FormData>
                name="budget"
                label=""
                placeholder="Select budget level"
                options={budgetOptions}
                clearable
              />
            </div>

            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={generatePlan.isPending || !watch("goal")}
                isLoading={generatePlan.isPending}
                className="gap-2"
              >
                <Sparkles className="size-4" />
                Generate Plan
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
