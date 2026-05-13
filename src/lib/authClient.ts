import { adminClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://mealio-nine.vercel.app"
      : "http://localhost:3000",
  plugins: [nextCookies(), adminClient()],
  user: {
    additionalFields: {
      role: { type: "string" },
    },
  },
});

export const { useSession, signOut } = authClient;
