"use server"; // ← Add this

import db from "@/lib/db";

export const getCategories = async () => {
  return await db.category.findMany({});
};
