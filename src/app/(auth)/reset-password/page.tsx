import { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-10 flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Mealio.ai"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="text-foreground text-xl font-bold tracking-tight">
          Mealio<span style={{ color: "#7DC52A" }}>.ai</span>
        </span>
      </Link>
      {/* Suspense needed because ResetPasswordForm uses useSearchParams */}
      <Suspense
        fallback={
          <div className="text-muted-foreground text-sm">Loading...</div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
