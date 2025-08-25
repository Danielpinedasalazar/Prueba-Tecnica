'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { ArrowRight, LogIn } from 'lucide-react';

export function SignInGithubButton() {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider: 'github',
          callbackURL: '/',
          errorCallbackURL: '/auth/error',
        })
      }
      className="w-full gap-2 rounded-lg bg-emerald-200 text-foreground hover:bg-emerald-300 transition-colors"
    >
      <LogIn className="h-4 w-4" />
      Iniciar sesión
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
