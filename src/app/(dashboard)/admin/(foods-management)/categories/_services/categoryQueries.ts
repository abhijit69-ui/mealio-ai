"use server"; // ← Add this

import db from "@/lib/db";
import { CategorySchema } from "../_types/categorySchema";

export const getCategories = async () => {
  return await db.category.findMany();
};

export const getCategory = async (id: number): Promise<CategorySchema> => {
  const res = await db.category.findFirst({
    where: { id },
  });

  return {
    ...res,
    action: "update",
    name: res?.name ?? "",
    id,
  };
};
