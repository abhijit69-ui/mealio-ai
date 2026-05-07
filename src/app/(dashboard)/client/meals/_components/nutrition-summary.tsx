"use client";

import { DayNutrition } from "../_services/mealQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Beef, Droplets, Flame, Leaf, Utensils, Wheat } from "lucide-react";

type Props = { nutrition: DayNutrition };

export default function NutritionSummary({ nutrition }: Props) {
  const cards = [
    {
      label: "Total Calories",
      value: `${Math.round(nutrition.calories)} kcal`,
      icon: <Flame className="size-5 text-orange-400" />,
      sub: null,
    },
    {
      label: "Macronutrients",
      icon: <Beef className="size-5 text-red-400" />,
      value: null,
      sub: (
        <div className="mt-2 flex gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Protein</p>
            <p className="font-semibold">{Math.round(nutrition.protein)}g</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Carbs</p>
            <p className="font-semibold">{Math.round(nutrition.carbs)}g</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Fat</p>
            <p className="font-semibold">{Math.round(nutrition.fat)}g</p>
          </div>
        </div>
      ),
    },
    {
      label: "Meal Summary",
      icon: <Utensils className="size-5 text-green-400" />,
      value: null,
      sub: (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Meals</span>
            <span className="font-semibold">{nutrition.totalMeals}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Food Items</span>
            <span className="font-semibold">{nutrition.totalFoodItems}</span>
          </div>
        </div>
      ),
    },
    {
      label: "Other Nutrients",
      icon: <Leaf className="size-5 text-emerald-400" />,
      value: null,
      sub: (
        <div className="mt-2 flex gap-8">
          <div>
            <p className="text-muted-foreground text-xs">Fiber</p>
            <p className="font-semibold">{Math.round(nutrition.fiber)}g</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Sugar</p>
            <p className="font-semibold">{Math.round(nutrition.sugar)}g</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {card.icon}
              <p className="text-muted-foreground text-sm">{card.label}</p>
            </div>
            {card.value && (
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
            )}
            {card.sub}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
