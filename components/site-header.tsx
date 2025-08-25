'use client';

import { LogOut, Menu, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';

function Brand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2">
      <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-tr from-primary/90 via-primary/60 to-primary/30 shadow-[0_0_24px_-6px] shadow-primary/60" />
      <span className="font-semibold tracking-tight">
        <span className="text-primary group-hover:opacity-90 transition-opacity">Finanzas</span>
      </span>
    </Link>
  );
}

const DesktopLink = ({ href, label }: { href: string; label: string }) => {
  const { asPath } = useRouter();
  const active = asPath === href;
  return (
    <Link
      href={href}
      className={[
        'relative px-3 py-2 text-sm rounded-md transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      {label}
      <span
        className={[
          'absolute left-3 right-3 -bottom-0.5 h-0.5 rounded bg-primary transition-transform',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        ].join(' ')}
      />
    </Link>
  );
};

export function SiteHeader() {
  const { data: session } = authClient.useSession();

  const role =
    (session?.user as unknown as { role?: 'ADMIN' | 'USER' } | undefined)?.role ?? 'USER';
  const isAdmin = role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 border-b bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page h-14 flex items-center justify-between gap-3">
        <Brand />

        <nav className="hidden md:flex items-center gap-1">
          <DesktopLink href="/movimientos" label="Movimientos" />
          {isAdmin && <DesktopLink href="/usuarios" label="Usuarios" />}
          {isAdmin && <DesktopLink href="/reportes" label="Reportes" />}
          <Link
            href="/api/docs"
            className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            API Docs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0 sm:max-w-[380px]">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="flex items-center gap-2">
                  <span className="inline-block h-5 w-5 rounded bg-primary/70" />
                  Navegación
                </DialogTitle>
              </DialogHeader>
              <Separator />
              <div className="p-2">
                <Link
                  href="/movimientos"
                  className="block w-full rounded-md px-4 py-3 text-sm hover:bg-muted transition-colors"
                >
                  Movimientos
                </Link>
                {isAdmin && (
                  <Link
                    href="/usuarios"
                    className="block w-full rounded-md px-4 py-3 text-sm hover:bg-muted transition-colors"
                  >
                    Usuarios
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/reportes"
                    className="block w-full rounded-md px-4 py-3 text-sm hover:bg-muted transition-colors"
                  >
                    Reportes
                  </Link>
                )}
                <Link
                  href="/api/docs"
                  className="block w-full rounded-md px-4 py-3 text-sm hover:bg-muted transition-colors"
                >
                  API Docs
                </Link>
              </div>
              <Separator />
              <div className="p-4">
                {!session ? (
                  <Button asChild size="sm">
                    <Link href="/api/auth/signin/github?callbackURL=/&errorCallbackURL=/auth/error">
                      Entrar
                    </Link>
                  </Button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
                        <AvatarFallback>
                          {(session.user.name ?? 'U').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium leading-none">
                          {session.user.name ?? 'Usuario'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {session.user.email ?? ''}
                        </div>
                      </div>
                    </div>
                    <Badge className="uppercase" variant="secondary">
                      {role}
                    </Badge>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Desktop: auth */}
          {!session ? (
            <Button
              size="sm"
              className="hidden md:inline-flex"
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
                <Avatar className="h-9 w-9 ring-1 ring-border hover:ring-primary/40 transition">
                  <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
                  <AvatarFallback>
                    {(session.user.name ?? 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name ?? 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email ?? ''}
                    </p>
                    <Badge className="mt-1 uppercase" variant="secondary">
                      {role}
                    </Badge>
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

      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </header>
  );
}
