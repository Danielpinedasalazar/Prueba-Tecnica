'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const { asPath } = useRouter();
  const active = asPath === href;
  return (
    <Link
      href={href}
      className={`text-sm px-3 py-2 rounded-md ${active ? 'bg-secondary' : 'hover:bg-secondary/60'}`}
    >
      {label}
    </Link>
  );
};

export function SiteHeader() {
  const { data: session } = authClient.useSession();

  return (
    <header className="border-b sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page h-14 flex items-center justify-between gap-3">
        <Link href="/" className="font-semibold text-lg">
          Prevalentware<span className="text-primary">/Finanzas</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/movimientos" label="Movimientos" />
          <NavLink href="/usuarios" label="Usuarios" />
          <NavLink href="/reportes" label="Reportes" />
          <a href="/api/docs" className="text-sm px-3 py-2 rounded-md hover:bg-secondary/60">
            API Docs
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {!session ? (
            <Button
              size="sm"
              onClick={() =>
                authClient.signIn.social({
                  provider: 'github',
                  callbackURL: '/',
                  errorCallbackURL: '/auth/error',
                })
              }
            >
              Entrar
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
                  <AvatarFallback>
                    {(session.user.name ?? 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name ?? 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/me" className="flex items-center">
                    <UserRound className="h-4 w-4 mr-2" /> Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => authClient.signOut({ query: { callbackURL: '/' } })}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
