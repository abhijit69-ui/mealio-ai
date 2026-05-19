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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarDays,
  MoreHorizontal,
  Plus,
  Trash2,
  Wand2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useDeletePlan } from "../_services/useMealPlanMutation";

import CreatePlanDialog from "./create-plan-dialog";
import GeneratePlanWithAIDialog from "./generate-plan-with-ai-dialog";

import { Prisma } from "$/generated/prisma/client";
import Image from "next/image";

type Plan = Prisma.MealPlanGetPayload<{
  include: { items: true };
}>;

type Props = {
  plans: Plan[];
  userId: string;
};

export default function PlansListView({ plans, userId }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const router = useRouter();
  const deletePlan = useDeletePlan();

  const handleConfirmDelete = () => {
    if (!planToDelete) return;

    deletePlan.mutate(planToDelete.id, {
      onSuccess: () => setPlanToDelete(null),
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Meal Plans</h1>

          <p className="text-muted-foreground text-sm">
            {plans.length} plan{plans.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setGenerateOpen(true)}
            className="gap-2"
          >
            <Wand2 className="size-4" />
            Generate with AI
          </Button>

          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <CalendarDays className="text-muted-foreground size-8" />
          </div>

          <p className="text-muted-foreground text-sm">No plans yet</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setGenerateOpen(true)}
              className="gap-2"
            >
              <Wand2 className="size-4" />
              Generate with AI
            </Button>

            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create your first plan
            </Button>
          </div>
        </div>
      ) : (
        /* Plans Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="group hover:border-primary cursor-pointer transition-colors"
              onClick={() => router.push(`/client/planner/${plan.id}`)}
            >
              <CardContent className="space-y-4 p-5">
                <div className="relative h-36 w-full overflow-hidden rounded-xl">
                  <Image
                    src="/images/plan-image.png"
                    alt={plan.name}
                    fill
                    className="object-cover"
                  />
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
                          className="size-8"
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
                          setPlanToDelete(plan);
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

      {/* Dialogs */}
      <CreatePlanDialog
        open={createOpen}
        userId={userId}
        onClose={() => setCreateOpen(false)}
      />

      <GeneratePlanWithAIDialog
        open={generateOpen}
        userId={userId}
        onClose={() => setGenerateOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!planToDelete}
        onOpenChange={(o) => !o && setPlanToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-foreground font-medium">
                {planToDelete?.name}
              </span>
              ? This will permanently remove the plan and all its meals. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlanToDelete(null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePlan.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
