import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { getRole } from '@/types/session';
import { ArrowRight, BarChart3, FileText, LogIn, ShieldCheck, Users2, Wallet } from 'lucide-react';
import Link from 'next/link';

const Tech = ({ t }: { t: string }) => (
  <Badge variant="secondary" className="text-xs">
    {t}
  </Badge>
);

export default function Home() {
  const { data: session } = authClient.useSession();
  const isAdmin = getRole(session) === 'ADMIN';

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border bg-card/70 backdrop-blur-sm">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
        </div>

        <div className="relative p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Demo técnica — Better Auth + RBAC
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Sistema de Ingresos y Gastos
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">
            Plataforma full-stack con autenticación segura, control de roles, reportes interactivos
            y documentación API viva. Construida con Next.js (Pages), TypeScript, Prisma y shadcn.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              'Next.js (Pages Router)',
              'TypeScript',
              'Bun',
              'Tailwind v4',
              'shadcn',
              'Prisma',
              'Supabase (Postgres)',
              'Better Auth + GitHub',
              'Recharts',
              'OpenAPI/Swagger',
            ].map((t) => (
              <Tech key={t} t={t} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/movimientos">
                <Wallet className="mr-2 h-4 w-4" />
                Ir a Movimientos
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/api/docs" target="_blank" rel="noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Ver API Docs
              </Link>
            </Button>
            {!session?.user && (
              <Button asChild variant="ghost" size="sm" className="gap-1 cursor-pointer">
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/movimientos" className="block group">
          <Card className="h-full transition-all duration-200 group-hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Movimientos</CardTitle>
                <CardDescription>CRUD de ingresos y egresos</CardDescription>
              </div>
              <div className="rounded-lg border p-2 text-primary bg-primary/10">
                <Wallet className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Crear, editar y eliminar.</p>
              <div className="text-xs text-muted-foreground">
                Concepto · Monto · Fecha · Usuario
              </div>
            </CardContent>
          </Card>
        </Link>

        {isAdmin && (
          <Link href="/usuarios" className="block group">
            <Card className="h-full transition-all duration-200 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuarios</CardTitle>
                  <CardDescription>Gestión de roles y datos</CardDescription>
                </div>
                <div className="rounded-lg border p-2 text-primary bg-primary/10">
                  <Users2 className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Listado y edición de <em>rol</em>, nombre y teléfono
                </p>
                <div className="text-xs text-muted-foreground">RBAC server + client</div>
              </CardContent>
            </Card>
          </Link>
        )}

        {isAdmin && (
          <Link href="/reportes" className="block group">
            <Card className="h-full transition-all duration-200 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Reportes</CardTitle>
                  <CardDescription>KPIs y gráfico mensual</CardDescription>
                </div>
                <div className="rounded-lg border p-2 text-primary bg-primary/10">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Saldo actual, comparativo mensual e <strong>export CSV</strong>.
                </p>
                <div className="text-xs text-muted-foreground">Recharts · CSV · API</div>
              </CardContent>
            </Card>
          </Link>
        )}
      </section>

      <Separator />

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Cómo funciona</CardTitle>
            <CardDescription>Arquitectura, flujos y pautas de uso</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Autenticación con GitHub y sesión en Postgres (Better Auth + Prisma).</li>
              <li>
                RBAC: los usuarios nuevos se crean como <strong>ADMIN</strong> para pruebas.
              </li>
              <li>Movimientos: validación en server + UI con shadcn (tabla, diálogos y toasts).</li>
              <li>Reportes: agregación por mes, KPIs y descarga CSV.</li>
              <li>
                Swagger: documentación viva en <code className="font-mono">/api/docs</code>.
              </li>
            </ol>
            <div className="pt-3 flex gap-2">
              {isAdmin && (
                <Button asChild size="sm">
                  <Link href="/reportes">Ver reportes</Link>
                </Button>
              )}
              <Button asChild size="sm" variant="secondary">
                <Link href="/api/docs">API Docs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Enlaces rápidos</CardTitle>
            <CardDescription>Navega por las áreas clave del sistema</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Link
              href="/movimientos"
              className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/40 transition-colors"
            >
              <span>Registrar un movimiento</span>
              <ArrowRight className="h-4 w-4 opacity-70" />
            </Link>
            {isAdmin && (
              <Link
                href="/usuarios"
                className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/40 transition-colors"
              >
                <span>Gestionar usuarios y roles</span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/api/reportes/csv"
                className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/40 transition-colors"
              >
                <span>Descargar CSV de movimientos</span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            )}
            <Link
              href="/api/docs"
              className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/40 transition-colors"
            >
              <span>Documentación de la API (Swagger)</span>
              <ArrowRight className="h-4 w-4 opacity-70" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
