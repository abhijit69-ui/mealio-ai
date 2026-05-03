import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserPlans } from "./_services/mealPlanMutation";
import PlansListView from "./_components/plans-list-view";

export default async function PlannerPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const plans = await getUserPlans(session.user.id);

  return <PlansListView plans={plans} userId={session.user.id} />;
}
