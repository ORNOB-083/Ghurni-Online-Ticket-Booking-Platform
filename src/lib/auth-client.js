import { createAuthClient } from "better-auth/react";
import { adminClient, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    adminClient(),
    jwtClient()
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

