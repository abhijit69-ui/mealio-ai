-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "mealPlanId" INTEGER;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
