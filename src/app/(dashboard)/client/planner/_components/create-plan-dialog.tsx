"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import { useCreatePlan } from "../_services/useMealPlanMutation";

type Props = { open: boolean; userId: string; onClose: () => void };

export default function CreatePlanDialog({ open, userId, onClose }: Props) {
  const [name, setName] = useState("My Weekly Plan");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const createPlan = useCreatePlan(userId);

  const endDate = format(addDays(new Date(startDate), 6), "MMM d, yyyy");

  const handleSubmit = () => {
    if (!name.trim()) return;
    createPlan.mutate(
      { name, startDate: new Date(startDate) },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create a New Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cut Phase Week 1"
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Plan ends on {endDate} (7 days)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={createPlan.isPending}
            disabled={!name.trim()}
          >
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
