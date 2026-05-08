import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMealsByDate } from "./_services/mealQueries";
import MealsView from "./_components/meals-view";

export default async function MealsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const today = new Date();
  const { mealsByType, nutrition, planId } = await getMealsByDate(
    session.user.id,
    today,
  );

  return (
    <MealsView
      userId={session.user.id}
      initialMealsByType={mealsByType}
      initialNutrition={nutrition}
      initialDate={today}
      initialPlanId={planId}
    />
  );
}
