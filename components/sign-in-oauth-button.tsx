'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

type Provider = 'github' | 'google';

export function SignInOauthButton({
  provider,
  signUp = false,
  label,
}: {
  provider: Provider;
  signUp?: boolean;
  label?: string;
}) {
  const text =
    label ??
    (provider === 'github'
      ? signUp
        ? 'Registrarme con GitHub'
        : 'Entrar con GitHub'
      : signUp
        ? 'Registrarme con Google'
        : 'Entrar con Google');

  return (
    <Button
      className="w-full"
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: '/',
          errorCallbackURL: '/auth/error',
        })
      }
    >
      {text}
    </Button>
  );
}
