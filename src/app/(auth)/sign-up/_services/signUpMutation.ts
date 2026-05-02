"use server";

import { executeAction } from "@/lib/executeAction";
import { signUpSchema, SignUpSchema } from "../_types/signUpSchema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signUp = async (data: SignUpSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = signUpSchema.parse(data);
      await auth.api.signUpEmail({
        body: {
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        },
        headers: await headers(), // ← required
      });
    },
  });
};
