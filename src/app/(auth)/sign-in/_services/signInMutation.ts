"use server";

import { signInSchema, SignInSchema } from "../_types/signInSchema";
import { executeAction } from "@/lib/executeAction";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signIn = async (data: SignInSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = signInSchema.parse(data);
      await auth.api.signInEmail({
        body: {
          email: validatedData.email,
          password: validatedData.password,
        },
        headers: await headers(),
      });
    },
  });
};

export const signOut = async () => {
  await executeAction({
    actionFn: async () => {
      await auth.api.signOut({
        headers: await headers(),
      });
    },
  });
};
