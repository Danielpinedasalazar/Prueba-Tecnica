'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { authClient } from '@/lib/auth-client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { ExternalLink, Github, Mail, ShieldCheck } from 'lucide-react';

const STACK_BADGES = [
  'Next.js (Pages Router)',
  'TypeScript',
  'Tailwind v4',
  'shadcn/ui',
  'Prisma',
  'Supabase',
  'Better Auth',
  'Recharts',
  'OpenAPI',
];

export function SiteFooter() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as any)?.role ?? 'USER';
  const isAdmin = role === 'ADMIN';
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="mt-16 border-t bg-background/60">
      <div className="container-page py-10">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand + blurb */}
          <section className="space-y-3 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-block h-6 w-6 rounded-md bg-primary/70" />
              <span className="font-semibold tracking-tight">
                <span className="text-primary">Finanzas</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground">
              Demo técnica de un sistema de ingresos y gastos con autenticación, RBAC y reportes.
            </p>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Sesiones seguras con Better Auth + Prisma</span>
            </p>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="icon" asChild aria-label="Abrir GitHub">
                <a href="https://github.com/" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Enviar correo">
                <a href="mailto:hello@example.com">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </section>

          <nav className="grid gap-6 sm:grid-cols-2 md:col-span-2">
            <div>
              <h4 className="mb-3 text-sm font-semibold">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/movimientos" className="hover:text-foreground">
                    Movimientos
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/usuarios" className="hover:text-foreground">
                      Usuarios
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <Link href="/reportes" className="hover:text-foreground">
                      Reportes
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">Desarrolladores</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/api/docs"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    API Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="/api/openapi.json" className="hover:text-foreground">
                    OpenAPI JSON
                  </a>
                </li>
                <li>
                  <span className="pointer-events-none opacity-60">Status (próximamente)</span>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-wrap gap-2">
          {STACK_BADGES.map((t) => (
            <Badge key={t} variant="secondary" className="text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t bg-background/60">
        <div className="container-page flex h-14 flex-col items-center justify-center gap-2 text-xs text-muted-foreground sm:h-12 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <a href="/api/docs" className="hover:text-foreground">
              API Docs
            </a>
            <a href="#" className="hover:text-foreground">
              Términos
            </a>
            <a href="#" className="hover:text-foreground">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
