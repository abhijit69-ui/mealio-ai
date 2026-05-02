import { useServingUnitsStore } from "../_lib/useServingUnitStore";

import { useQuery } from "@tanstack/react-query";
import { getServingUnit, getServingUnits } from "./services";

export const useServingUnits = () => {
  return useQuery({
    queryKey: ["servingUnits"],
    queryFn: getServingUnits,
  });
};

export const useServingUnit = () => {
  const { selectedServingUnitId } = useServingUnitsStore();

  return useQuery({
    queryKey: ["servingUnits", { selectedServingUnitId }],
    queryFn: () => getServingUnit(selectedServingUnitId!),
    enabled: !!selectedServingUnitId,
  });
};
