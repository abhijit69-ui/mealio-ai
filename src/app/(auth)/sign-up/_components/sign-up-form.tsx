"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  signUpDefaultValues,
  signUpSchema,
  SignUpSchema,
} from "../_types/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput } from "@/components/ui/controlled-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignUp } from "../_services/useSignUpMutation";
import { authClient } from "@/lib/authClient";

export default function SignUpForm() {
  const form = useForm<SignUpSchema>({
    defaultValues: signUpDefaultValues,
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useSignUp();

  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    signUpMutation.mutate(data);
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  return (
    <FormProvider {...form}>
      <div className="w-full max-w-sm">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-foreground mb-1.5 text-3xl font-extrabold tracking-tight">
            Create account
          </h2>
          <p className="text-muted-foreground text-sm">
            Sign up free — no credit card required
          </p>
        </div>

        {/* Google button — above the form, prominent */}
        <Button
          type="button"
          variant="outline"
          className="mb-5 h-11 w-full rounded-xl text-sm font-medium"
          onClick={handleGoogleSignUp}
        >
          <svg viewBox="0 0 24 24" className="mr-2 size-4 shrink-0">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative mb-5 flex items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-xs">
            or sign up with email
          </span>
          <div className="bg-border h-px flex-1" />
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <ControlledInput<SignUpSchema> name="name" label="Full Name" />
            <ControlledInput<SignUpSchema> name="email" label="Email" />
            <ControlledInput<SignUpSchema>
              name="password"
              label="Password"
              type="password"
            />
            <ControlledInput<SignUpSchema>
              name="confirmPassword"
              label="Confirm Password"
              type="password"
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
            isLoading={signUpMutation.isPending}
          >
            Create Account
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold transition-colors duration-200 hover:underline"
              style={{ color: "#7DC52A" }}
            >
              Sign in
            </Link>
          </p>

          <p className="text-muted-foreground/60 text-center text-xs leading-relaxed">
            By creating an account you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-muted-foreground underline underline-offset-2 transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-muted-foreground underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </FormProvider>
  );
}
