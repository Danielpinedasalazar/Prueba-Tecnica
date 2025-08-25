'use client';

import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';

export function SignInOauthButton() {
  return (
    <Button
      asChild
      className="w-full gap-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
    >
      <Link href="/api/auth/signin/github?callbackURL=/&errorCallbackURL=/auth/error">
        <Github className="h-4 w-4" />
        Entrar con GitHub
      </Link>
    </Button>
  );
}
