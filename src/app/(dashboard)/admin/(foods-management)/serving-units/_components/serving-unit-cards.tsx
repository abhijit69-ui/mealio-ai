"use client";

import { Button } from "@/components/ui/button";
import { alert } from "@/lib/useGlobalStore";
import { Edit, Trash } from "lucide-react";
import { useServingUnitsStore } from "../_lib/useServingUnitStore";
import { useServingUnits } from "../_services/useQueries";
import { useDeleteServingUnit } from "../_services/useMutation";
import NoItemsFound from "@/components/no-items-found";
import ServingUnitCardsSkeleton from "./serving-unit-skeleton";

export default function ServingUnitCards() {
  const { updateSelectedServingUnitId, updateServingUnitDialogOpen } =
    useServingUnitsStore();

  const servingUnitsQuery = useServingUnits();
  const deleteServingUnitMutation = useDeleteServingUnit();

  if (servingUnitsQuery.data?.length === 0) {
    return <NoItemsFound onClick={() => updateServingUnitDialogOpen(true)} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {servingUnitsQuery.isLoading ? (
        <ServingUnitCardsSkeleton />
      ) : (
        <>
          {servingUnitsQuery.data?.map((item) => (
            <div
              className="flex flex-col justify-between gap-3 rounded-lg border p-6"
              key={item.id}
            >
              <p className="truncate">{item.name}</p>
              <div className="flex gap-1">
                <Button
                  className="size-6"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    updateSelectedServingUnitId(item.id);
                    updateServingUnitDialogOpen(true);
                  }}
                >
                  <Edit />
                </Button>
                <Button
                  className="size-6"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    alert({
                      onConfirm: () =>
                        deleteServingUnitMutation.mutate(item.id),
                    });
                  }}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
