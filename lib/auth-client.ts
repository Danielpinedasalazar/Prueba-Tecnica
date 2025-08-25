import { createAuthClient } from 'better-auth/react';

const baseURL =
  process.env.NEXT_PUBLIC_APP_ORIGIN ??
  (typeof window !== 'undefined' ? window.location.origin : undefined);

const client = createAuthClient({
  baseURL,
});

export const authClient = client;

export const { signIn, signOut, useSession } = client;

export default authClient;
