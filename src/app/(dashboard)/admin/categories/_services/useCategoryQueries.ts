import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./categoryQueries";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
