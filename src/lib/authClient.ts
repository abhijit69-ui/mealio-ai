import { adminClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [nextCookies(), adminClient()],
});

// export session hook for convenience
export const { useSession, signOut } = authClient;
