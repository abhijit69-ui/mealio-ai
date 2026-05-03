"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import MealCard from "./meal-card";
import AddMealDialog from "./add-meal-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { MealPlanWithItems } from "../_types/plannerTypes";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"] as const;

type Props = { plan: MealPlanWithItems; userId: string };

export default function PlannerView({ plan, userId }: Props) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] =
    useState<(typeof DAYS)[number]>("MONDAY");
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    day: (typeof DAYS)[number];
    type: (typeof MEAL_TYPES)[number];
  } | null>(null);

  const getMealForSlot = (day: string, type: string) =>
    plan.items.find((item) => item.day === day && item.type === type);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS.map((day, i) => {
          const date = addDays(new Date(plan.startDate), i);
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex min-w-18 flex-col items-center rounded-xl px-4 py-3 transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted border"
              }`}
            >
              <span className="text-sm font-medium">{DAY_LABELS[i]}</span>
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
        {DAY_LABELS[DAYS.indexOf(selectedDay)]},{" "}
        {format(
          addDays(new Date(plan.startDate), DAYS.indexOf(selectedDay)),
          "MMMM d",
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
