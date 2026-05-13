"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "../_types/signUpSchema";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpSchema) => {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      router.replace("/check-email"); // ← now exists
    },
    onError: (error) => {
      toast.error(error.message || "Sign up failed");
    },
  });
};
