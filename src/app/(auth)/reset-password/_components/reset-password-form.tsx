"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { passwordSchema } from "@/lib/zodSchemas";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setErrors(result.error.errors.map((e) => e.message));
      return;
    }

    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    setLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      toast.error(
        error.message || "Failed to reset password. The link may have expired.",
      );
    } else {
      toast.success("Password reset successfully");
      router.push("/sign-in");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h2 className="text-foreground mb-1.5 text-3xl font-extrabold tracking-tight">
          Reset password
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose a strong new password for your account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="mb-1.5 block text-sm">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 8 chars, upper, lower, number, symbol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-1.5 block text-sm">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        {errors.length > 0 && (
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-destructive text-sm">
                {err}
              </li>
            ))}
          </ul>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #7DC52A, #5fa31e)",
            color: "#fff",
            border: "none",
          }}
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
