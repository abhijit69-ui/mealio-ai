"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    // ─── FIX: use requestPasswordReset instead of forgetPassword ───
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <div
            className="flex size-16 items-center justify-center rounded-full"
            style={{ background: "#7DC52A15" }}
          >
            <CheckCircle className="size-7" style={{ color: "#7DC52A" }} />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold">Check your email</h2>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          We sent a password reset link to{" "}
          <span className="text-foreground font-medium">{email}</span>. It
          expires in 1 hour.
        </p>
        <Button variant="outline" className="w-full rounded-xl">
          <Link href="/sign-in">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h2 className="text-foreground mb-1.5 text-3xl font-extrabold tracking-tight">
          Forgot password?
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email" className="mb-1.5 block text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #7DC52A, #5fa31e)",
            color: "#fff",
            border: "none",
          }}
          disabled={loading || !email.trim()}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-semibold transition-colors hover:underline"
            style={{ color: "#7DC52A" }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
