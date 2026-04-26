import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategory } from "./categoryQueries";
import { useCategoriesStore } from "../_lib/useCategoryStore";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useCategory = () => {
  const { selectedCategoryId } = useCategoriesStore();
  return useQuery({
    queryKey: ["categories", { selectedCategoryId }],
    queryFn: () => getCategory(selectedCategoryId!),
    enabled: !!selectedCategoryId,
  });
};
