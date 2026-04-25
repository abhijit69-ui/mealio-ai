"use client";

import React from "react";
import { useCategories } from "../_services/useCategoryQueries";
import { useDeleteCategory } from "../_services/useCategoryMutation";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { alert } from "@/lib/useGlobalStore";

export default function CategoryCards() {
  const categoriesQuery = useCategories();
  const deleteCategoryMutation = useDeleteCategory();
  return (
    <div className="grid grid-cols-4 gap-2">
      {categoriesQuery.data?.map((item) => (
        <div
          className="bg-accent flex flex-col justify-between gap-3 rounded-lg p-6 shadow-md"
          key={item.id}
        >
          <p className="truncate">{item.name}</p>
          <div className="flex gap-1">
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              onClick={() => {}}
            >
              <Edit />
            </Button>
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              onClick={() => {
                alert({
                  onConfirm: () => deleteCategoryMutation.mutate(item.id),
                });
              }}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
