import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "./_components/sign-in-form";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === "admin") redirect("/admin/foods");
  if (session?.user?.role === "user") redirect("/client");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default Page;
