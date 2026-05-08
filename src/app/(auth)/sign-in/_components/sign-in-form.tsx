"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  signInDefaultValues,
  signInSchema,
  SignInSchema,
} from "../_types/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "../_services/useSignInMutation";
import { ControlledInput } from "@/components/ui/controlled-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInForm() {
  const form = useForm<SignInSchema>({
    defaultValues: signInDefaultValues,
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useSignIn();

  const onSubmit: SubmitHandler<SignInSchema> = (data) => {
    signInMutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <div className="w-full max-w-sm">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-foreground mb-1.5 text-3xl font-extrabold tracking-tight">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to your meal planner
          </p>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <ControlledInput<SignInSchema> name="email" label="Email" />
            <ControlledInput<SignInSchema>
              name="password"
              label="Password"
              type="password"
            />
          </div>

          {/* Forgot password */}
          <div className="-mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #7DC52A, #5fa31e)",
              color: "#fff",
              border: "none",
            }}
            isLoading={signInMutation.isPending}
          >
            Sign In
          </Button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 py-1">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs">or</span>
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Sign up link */}
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold transition-colors duration-200 hover:underline"
              style={{ color: "#7DC52A" }}
            >
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </FormProvider>
  );
}
