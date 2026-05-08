"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
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
  initialPlanId: number | null;
};

export default function MealsView({
  userId,
  initialMealsByType,
  initialNutrition,
  initialDate,
  initialPlanId,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const mealsQuery = useMealsByDate(userId, selectedDate);

  const planId = mealsQuery.data?.planId ?? initialPlanId;
  const mealsByType = mealsQuery.data?.mealsByType ?? initialMealsByType;
  const nutrition = mealsQuery.data?.nutrition ?? initialNutrition;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meals</h1>
          <p className="text-muted-foreground text-sm">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/*
          Mobile:  flex-col → buttons stack and each is full width
          Desktop: flex-row → buttons sit side by side, natural width
        */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {planId && (
            <Link
              href={`/client/planner/${planId}`}
              className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:w-auto"
            >
              <ArrowLeft className="size-3.5" />
              Go to Planner
            </Link>
          )}

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 sm:w-auto"
                >
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
      </div>

      {mealsQuery.isLoading && !mealsQuery.data ? (
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
