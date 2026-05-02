import { adminClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [nextCookies(), adminClient()],
  // ↓ expose role on client side too
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});

export const { useSession, signOut } = authClient;
