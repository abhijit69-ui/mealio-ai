"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignInSchema } from "../_types/signInSchema";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInSchema) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: async (data) => {
      const role = data?.user?.role;
      if (role === "admin") {
        router.replace("/admin/foods");
      } else {
        router.replace("/client");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Invalid email or password");
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      router.push("/sign-in");
    },
  });
};
