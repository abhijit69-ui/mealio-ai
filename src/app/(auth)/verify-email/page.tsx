"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`, {
      credentials: "include",
    })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border p-8 text-center shadow-sm">
        {status === "loading" && (
          <>
            <div className="mb-4 flex justify-center">
              <Loader2
                className="size-12 animate-spin"
                style={{ color: "#7DC52A" }}
              />
            </div>
            <h2 className="mb-2 text-xl font-bold">Verifying your email...</h2>
            <p className="text-muted-foreground text-sm">
              Please wait a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4 flex justify-center">
              <CheckCircle className="size-12" style={{ color: "#7DC52A" }} />
            </div>

            <h2 className="mb-2 text-xl font-bold">Email verified!</h2>

            <p className="text-muted-foreground mb-6 text-sm">
              Your email has been verified. Redirecting you to your dashboard...
            </p>

            <Button
              className="w-full rounded-xl"
              style={{
                background: "linear-gradient(135deg,#7DC52A,#5fa31e)",
                color: "#fff",
                border: "none",
              }}
            >
              <Link href="/client/planner">Go to Dashboard</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4 flex justify-center">
              <XCircle className="text-destructive size-12" />
            </div>

            <h2 className="mb-2 text-xl font-bold">Verification failed</h2>

            <p className="text-muted-foreground mb-6 text-sm">
              This link may have expired or already been used. Please sign in to
              request a new link.
            </p>

            <Button
              className="w-full rounded-xl"
              style={{
                background: "linear-gradient(135deg,#7DC52A,#5fa31e)",
                color: "#fff",
                border: "none",
              }}
            >
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
