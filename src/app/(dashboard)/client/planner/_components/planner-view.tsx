"use client";

import { useState } from "react";
import { format, addDays, getDay } from "date-fns";
import MealCard from "./meal-card";
import AddMealDialog from "./add-meal-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Day, MealType } from "$/generated/prisma/client";
import { MealPlanWithItems, MealSlot } from "../_types/plannerTypes";

const DATE_INDEX_TO_DAY: Day[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

type Props = { plan: MealPlanWithItems; userId: string };

export default function PlannerView({ plan, userId }: Props) {
  const router = useRouter();

  const planDays: Day[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(plan.startDate), i);
    return DATE_INDEX_TO_DAY[getDay(date)];
  });

  const getInitialDay = (): Day => {
    const today = new Date();
    const todayDayEnum = DATE_INDEX_TO_DAY[getDay(today)];
    // check if today's day enum exists in this plan's days
    return planDays.includes(todayDayEnum) ? todayDayEnum : planDays[0];
  };

  const [selectedDay, setSelectedDay] = useState<Day>(getInitialDay);

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    day: Day;
    type: MealType;
  } | null>(null);

  const getMealForSlot = (day: Day, type: MealType): MealSlot | undefined =>
    plan.items.find((item) => item.day === day && item.type === type);

  const selectedDayIndex = planDays.indexOf(selectedDay);

  return (
    // FIX: p-3 on mobile instead of p-6, scales up on larger screens
    <div className="space-y-4 p-3 sm:p-4 md:space-y-6 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => router.push("/client/planner")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0">
          {/* FIX: truncate long plan names on mobile */}
          <h1 className="truncate text-xl font-bold sm:text-2xl">
            {plan.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {format(new Date(plan.startDate), "MMM d")} –{" "}
            {format(new Date(plan.endDate), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Day Selector */}
      {/* FIX: -mx compensates for parent padding so scroll reaches edges on mobile */}
      <div className="-mx-3 sm:-mx-4 md:-mx-6">
        <div className="flex gap-2 overflow-x-auto px-3 pb-2 sm:px-4 md:px-6">
          {planDays.map((day, i) => {
            const date = addDays(new Date(plan.startDate), i);
            const isSelected = selectedDay === day;
            const dayOfWeek = getDay(date);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                // FIX: shrink-0 prevents buttons from compressing, they scroll instead
                className={`flex shrink-0 flex-col items-center rounded-xl px-3 py-2.5 transition-all sm:px-4 sm:py-3 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted border"
                }`}
              >
                <span className="text-xs font-medium sm:text-sm">
                  {DAY_LABELS[dayOfWeek]}
                </span>
                <span
                  className={`text-xs ${isSelected ? "opacity-80" : "text-muted-foreground"}`}
                >
                  {format(date, "MMM d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day label */}
      <h2 className="text-base font-semibold sm:text-lg">
        {format(
          addDays(new Date(plan.startDate), selectedDayIndex),
          "EEEE, MMMM d",
        )}
      </h2>

      {/* Meal Cards */}
      {/* FIX: single column on mobile, 3 cols on md+ (was already correct but kept explicit) */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {MEAL_TYPES.map((type) => (
          <MealCard
            key={type}
            type={type}
            slot={getMealForSlot(selectedDay, type)}
            onAdd={() => setDialogState({ open: true, day: selectedDay, type })}
          />
        ))}
      </div>

      {dialogState && (
        <AddMealDialog
          open={dialogState.open}
          day={dialogState.day}
          type={dialogState.type}
          planId={plan.id}
          userId={userId}
          onClose={() => setDialogState(null)}
        />
      )}
    </div>
  );
}
