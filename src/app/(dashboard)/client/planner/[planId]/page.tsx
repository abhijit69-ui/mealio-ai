import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getPlanById } from "../_services/mealPlanMutation";
import PlannerView from "../_components/planner-view";

type Props = { params: Promise<{ planId: string }> };

export default async function PlanDetailPage({ params }: Props) {
  const { planId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const plan = await getPlanById(Number(planId), session.user.id);
  if (!plan) notFound();

  return <PlannerView plan={plan} userId={session.user.id} />;
}
