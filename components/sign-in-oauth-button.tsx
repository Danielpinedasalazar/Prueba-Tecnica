'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Github, Loader2 } from 'lucide-react';
import * as React from 'react';

type Provider = 'github' | 'google';

export function SignInOauthButton(props: {
  provider: Provider;
  signUp?: boolean;
  label?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  className?: string;
}) {
  const {
    provider,
    signUp = false,
    label,
    variant = 'default',
    size = 'default',
    className,
  } = props;

  const [pending, setPending] = React.useState(false);

  const text =
    label ??
    (provider === 'github'
      ? signUp
        ? 'Registrarme con GitHub'
        : 'Entrar con GitHub'
      : signUp
        ? 'Registrarme con Google'
        : 'Entrar con Google');

  const brandIcon =
    provider === 'github' ? (
      <Github className="h-4 w-4" />
    ) : (
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="#EA4335"
          d="M12 10.2v3.84h5.44c-.24 1.44-1.65 4.2-5.44 4.2a6.24 6.24 0 1 1 0-12.48c1.8 0 3.01.72 3.7 1.35l2.52-2.43C16.86 3.57 14.67 2.64 12 2.64a9.36 9.36 0 1 0 0 18.72c5.4 0 8.96-3.78 8.96-9.12 0-.61-.07-1.07-.16-1.56H12Z"
        />
      </svg>
    );

  const brandClass =
    provider === 'github'
      ? 'bg-foreground text-background hover:opacity-90 dark:bg-white dark:text-black'
      : 'bg-white text-black hover:opacity-90 border border-input dark:bg-background dark:text-foreground';

  const handleClick = async () => {
    try {
      setPending(true);
      await authClient.signIn.social({
        provider,
        callbackURL: '/',
        errorCallbackURL: '/auth/error',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`w-full justify-center gap-2 ${variant === 'default' ? brandClass : ''} ${className ?? ''}`}
      disabled={pending}
      onClick={handleClick}
      aria-label={text}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : brandIcon}
      <span className="truncate">{text}</span>
    </Button>
  );
}
