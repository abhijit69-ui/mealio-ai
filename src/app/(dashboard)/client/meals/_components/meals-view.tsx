"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NutritionSummary from "./nutrition-summary";
import DayMealCards from "./day-meal-cards";
import { useMealsByDate } from "../_services/useMealQueries";
import { MealsByType, DayNutrition } from "../_services/mealQueries";
import { MealsSkeletonBody } from "./meals-skeleton";

type Props = {
  userId: string;
  initialMealsByType: MealsByType;
  initialNutrition: DayNutrition;
  initialDate: Date;
};

export default function MealsView({
  userId,
  initialMealsByType,
  initialNutrition,
  initialDate,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const mealsQuery = useMealsByDate(userId, selectedDate);

  const mealsByType = mealsQuery.data?.mealsByType ?? initialMealsByType;
  const nutrition = mealsQuery.data?.nutrition ?? initialNutrition;

  return (
    <div className="space-y-6 p-6">
      {/* Header — always visible */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meals</h1>
          <p className="text-muted-foreground text-sm">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger
            render={
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="size-4" />
                {format(selectedDate, "MMM d, yyyy")}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Everything below swaps to skeleton when loading */}
      {mealsQuery.isLoading && !mealsQuery.data ? (
        // ← render skeleton cards inline without the header
        <MealsSkeletonBody />
      ) : (
        <>
          <NutritionSummary nutrition={nutrition} />
          <h2 className="text-lg font-semibold">
            {format(selectedDate, "EEEE")}&apos;s Meals
          </h2>
          <DayMealCards
            mealsByType={mealsByType}
            userId={userId}
            date={selectedDate}
          />
        </>
      )}
    </div>
  );
}
