import { useQuery } from "@tanstack/react-query";
import { useFoodsStore } from "../_libs/useFoodStore";
import { getFood, getFoods } from "./foodQueries";

export const useFoods = () => {
  const { foodFilters } = useFoodsStore();

  return useQuery({
    queryKey: ["foods", foodFilters],
    queryFn: () => getFoods(foodFilters),
  });
};

export const useFood = () => {
  const { selectedFoodId } = useFoodsStore();

  return useQuery({
    queryKey: ["foods", { selectedFoodId }],
    queryFn: () => getFood(selectedFoodId!),
    enabled: !!selectedFoodId,
  });
};
