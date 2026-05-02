"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "../_types/signUpSchema";
import { signUp } from "./signUpMutation";
import { toast } from "sonner";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpSchema) => {
      await signUp(data);
    },
    onSuccess: () => {
      toast.success("Signed up successfully");
      router.replace("/sign-in");
    },
    onError: (error) => {
      toast.error(error.message || "Sign up failed");
    },
  });
};
