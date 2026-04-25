"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "./categoryMutation";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteCategory(id);
    },
    onSuccess: () => {
      // TODO: show user a toast
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
