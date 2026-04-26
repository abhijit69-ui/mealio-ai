import { ServingUnitSchema } from "../_types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createServingUnit,
  deleteServingUnit,
  updateServingUnit,
} from "./services";

export const useCreateServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServingUnitSchema) => {
      await createServingUnit(data);
    },
    onSuccess: () => {
      toast.success("Serving Unit created successfully.");
      queryClient.invalidateQueries({ queryKey: ["servingUnits"] });
    },
  });
};

export const useUpdateServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServingUnitSchema) => {
      await updateServingUnit(data);
    },
    onSuccess: () => {
      toast.success("Serving Unit updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["servingUnits"] });
    },
  });
};

export const useDeleteServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteServingUnit(id);
    },
    onSuccess: () => {
      toast.success("Serving Unit deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["servingUnits"] });
    },
  });
};
