"use server";

import { ServingUnitSchema } from "../_types/schema";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";

export const createServingUnit = async (data: ServingUnitSchema) => {
  await executeAction({
    actionFn: () =>
      db.servingUnit.create({
        data: {
          name: data.name,
        },
      }),
  });
};

export const updateServingUnit = async (data: ServingUnitSchema) => {
  if (data.action === "update") {
    await executeAction({
      actionFn: () =>
        db.servingUnit.update({
          where: { id: data.id },
          data: {
            name: data.name,
          },
        }),
    });
  }
};

export const deleteServingUnit = async (id: number) => {
  await executeAction({
    actionFn: () => db.servingUnit.delete({ where: { id } }),
  });
};

export const getServingUnits = async () => {
  return await db.servingUnit.findMany();
};

export const getServingUnit = async (
  id: number,
): Promise<ServingUnitSchema> => {
  const res = await db.servingUnit.findFirst({
    where: { id },
  });

  return {
    ...res,
    action: "update",
    name: res?.name ?? "",
    id,
  };
};
