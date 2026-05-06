"use client";

import { useState } from "react";
import { format, addDays, getDay } from "date-fns"; // ← add getDay
import MealCard from "./meal-card";
import AddMealDialog from "./add-meal-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Day, MealType } from "$/generated/prisma/client";
import { MealPlanWithItems, MealSlot } from "../_types/plannerTypes";

// Maps date-fns getDay() result (0=Sun, 1=Mon...) to Prisma Day enum
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

  // derive the 7 Day enum values from the actual startDate
  const planDays: Day[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(plan.startDate), i);
    return DATE_INDEX_TO_DAY[getDay(date)];
  });

  const [selectedDay, setSelectedDay] = useState<Day>(planDays[0]);

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    day: Day;
    type: MealType;
  } | null>(null);

  const getMealForSlot = (day: Day, type: MealType): MealSlot | undefined =>
    plan.items.find((item) => item.day === day && item.type === type);

  const selectedDayIndex = planDays.indexOf(selectedDay);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/client/planner")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{plan.name}</h1>
          <p className="text-muted-foreground text-sm">
            {format(new Date(plan.startDate), "MMM d")} –{" "}
            {format(new Date(plan.endDate), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Day Selector — derived from actual dates */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {planDays.map((day, i) => {
          const date = addDays(new Date(plan.startDate), i);
          const isSelected = selectedDay === day;
          const dayOfWeek = getDay(date);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex min-w-[72px] flex-col items-center rounded-xl px-4 py-3 transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted border"
              }`}
            >
              <span className="text-sm font-medium">
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

      {/* Day label */}
      <h2 className="text-lg font-semibold">
        {format(
          addDays(new Date(plan.startDate), selectedDayIndex),
          "EEEE, MMMM d",
        )}
      </h2>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
