'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { ExternalLink, Github, Heart, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const stack = [
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

type AppUser = { role?: 'ADMIN' | 'USER' };

export function SiteFooter() {
  const { data: session } = authClient.useSession();

  // Obtén el rol sin usar `any`
  const role: 'ADMIN' | 'USER' = (session?.user as unknown as AppUser | undefined)?.role ?? 'USER';

  const isAdmin = role === 'ADMIN';
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="mt-16 border-t bg-background/60">
      <div className="container-page py-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-block h-6 w-6 rounded-md bg-primary/70" />
              <span className="font-semibold tracking-tight">
                Prevalentware<span className="text-primary">/Finanzas</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground">
              Demo técnica de un sistema de ingresos y gastos con autenticación, RBAC y reportes.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Sesiones seguras con Better Auth + Prisma</span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="icon" asChild aria-label="GitHub">
                <a href="https://github.com/" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Contacto">
                <a href="mailto:hello@example.com">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:col-span-2">
            <div>
              <h4 className="text-sm font-semibold mb-3">Producto</h4>
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
              <h4 className="text-sm font-semibold mb-3">Desarrolladores</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/api/docs"
                    className="hover:text-foreground inline-flex items-center gap-1"
                  >
                    API Docs <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/api/openapi.json" className="hover:text-foreground">
                    OpenAPI JSON
                  </Link>
                </li>
                <li>
                  <span className="pointer-events-none opacity-60">Status (próximamente)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-wrap gap-2">
          {stack.map((t) => (
            <Badge key={t} variant="secondary" className="text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t bg-background/60">
        <div className="container-page h-14 flex flex-col gap-2 items-center justify-center text-xs text-muted-foreground sm:h-12 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-1">
            © {currentYear} Prevalentware · Hecho con
            <Heart className="h-3.5 w-3.5 text-primary" /> por el equipo.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/api/docs" className="hover:text-foreground">
              API Docs
            </Link>
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
