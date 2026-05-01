"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  foodDefaultValues,
  foodSchema,
  FoodSchema,
} from "../_types/foodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "../../categories/_services/useCategoryQueries";
import { useFood } from "../_services/useFoodQueries";
import { useCreateFood, useUpdateFood } from "../_services/useFoodMutation";
import { useFoodsStore } from "../_libs/useFoodStore";
import { useCategoriesStore } from "../../categories/_lib/useCategoryStore";
import { useServingUnitsStore } from "../../serving-units/_lib/useServingUnitStore";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import CategoryFormDialog from "../../categories/_components/category-form-dialog";

export default function FoodFormDialog() {
  const form = useForm<FoodSchema>({
    defaultValues: foodDefaultValues,
    resolver: zodResolver(foodSchema),
  });

  const foodQuery = useFood();
  const categoriesQuery = useCategories();

  const createFoodMutation = useCreateFood();
  const updateFoodMutation = useUpdateFood();

  const isPending =
    createFoodMutation.isPending || updateFoodMutation.isPending;

  const {
    selectedFoodId,
    updateSelectedFoodId,
    foodDialogOpen,
    updateFoodDialogOpen,
  } = useFoodsStore();

  const { categoryDialogOpen } = useCategoriesStore();
  const { servingUnitDialogOpen } = useServingUnitsStore();

  useEffect(() => {
    if (!!selectedFoodId && foodQuery.data) {
      form.reset(foodQuery.data);
    }
  }, [foodQuery.data, form, selectedFoodId]);

  const handleDialogOpenChange = (open: boolean) => {
    updateFoodDialogOpen(open);

    if (!open) {
      updateSelectedFoodId(null);
      form.reset(foodDefaultValues);
    }
  };

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };

  const disabledSubmit = servingUnitDialogOpen || categoryDialogOpen;

  const onSubmit: SubmitHandler<FoodSchema> = (data) => {
    if (data.action === "create") {
      createFoodMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
    } else {
      updateFoodMutation.mutate(data, { onSuccess: handleSuccess });
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedFoodId ? "Edit Food" : "Create a New Food"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={disabledSubmit ? undefined : form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ControlledInput<FoodSchema>
                  name="name"
                  label="Name"
                  placeholder="Enter food name"
                />
              </div>

              <div className="col-span-1 flex items-end">
                <ControlledSelect<FoodSchema>
                  label="Category"
                  name="categoryId"
                  options={categoriesQuery.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />

                <CategoryFormDialog smallTrigger />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="calories"
                  label="Calories"
                  type="number"
                  placeholder="kcal"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="protein"
                  label="Protein"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="carbohydrates"
                  label="Carbohydrates"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="fat"
                  label="Fat"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="fiber"
                  label="Fiber"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="sugar"
                  label="Sugar"
                  type="number"
                  placeholder="grams"
                />
              </div>
            </div>
          </FormProvider>

          <DialogFooter>
            <Button type="submit" isLoading={isPending}>
              {!!selectedFoodId ? "Edit" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
