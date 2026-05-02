import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardLayout from "./_components/dashboard-layout";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // console.log("SESSION:", JSON.stringify(session, null, 2));

  if (!session) redirect("/sign-in");

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
