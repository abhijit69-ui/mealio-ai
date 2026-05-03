"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeletePlan } from "../_services/useMealPlanMutation";
import CreatePlanDialog from "./create-plan-dialog";
import { Prisma } from "$/generated/prisma/client";

type Plan = Prisma.MealPlanGetPayload<{
  include: { items: true };
}>;

type Props = { plans: Plan[]; userId: string };

export default function PlansListView({ plans, userId }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const deletePlan = useDeletePlan();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Meal Plans</h1>
          <p className="text-muted-foreground text-sm">
            {plans.length} plan{plans.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <CalendarDays className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground text-sm">No plans yet</p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create your first plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="group hover:border-primary cursor-pointer transition-colors"
              onClick={() => router.push(`/client/planner/${plan.id}`)}
            >
              <CardContent className="space-y-4 p-5">
                <div className="bg-muted flex h-36 items-center justify-center overflow-hidden rounded-xl">
                  <CalendarDays className="text-muted-foreground size-10" />
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {format(new Date(plan.startDate), "MMM d")} –{" "}
                      {format(new Date(plan.endDate), "MMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {plan.items.length} / 21 slots filled
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlan.mutate(plan.id);
                        }}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreatePlanDialog
        open={createOpen}
        userId={userId}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
