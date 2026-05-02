"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignInSchema } from "../_types/signInSchema";
import { signIn, signOut } from "./signInMutation";
import { toast } from "sonner";
import { authClient } from "@/lib/authClient";

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInSchema) => {
      await signIn(data);
    },
    onSuccess: async () => {
      const session = await authClient.getSession();
      const role = session?.data?.user?.role;

      if (role === "admin") {
        router.replace("/admin/foods");
      } else {
        router.replace("/client");
      }
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.push("/sign-in");
    },
  });
};
