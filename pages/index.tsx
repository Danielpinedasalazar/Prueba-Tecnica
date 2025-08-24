import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const Tech = ({ t }: { t: string }) => (
  <Badge variant="secondary" className="text-xs">
    {t}
  </Badge>
);

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="page-title">Sistema de Ingresos y Gastos</h1>
        <p className="page-subtitle">
          Demo full‑stack con autenticación Better Auth, RBAC, Supabase, Prisma y UI con shadcn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/movimientos" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Movimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tabla de ingresos/egresos. Crear/editar/eliminar (solo ADMIN).
              </p>
              <div className="text-xs text-muted-foreground">
                Concepto · Monto · Fecha · Usuario
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/usuarios" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Gestión de usuarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Listado y edición de rol, nombre y teléfono (solo ADMIN).
              </p>
              <div className="text-xs text-muted-foreground">RBAC server + client</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reportes" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Saldo actual, gráfico mensual e <strong>export CSV</strong>.
              </p>
              <div className="text-xs text-muted-foreground">Recharts · CSV · API</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stack</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[
              'Next.js (Pages Router)',
              'TypeScript',
              'Bun',
              'Tailwind',
              'shadcn',
              'Prisma',
              'Supabase (Postgres)',
              'Better Auth + GitHub',
              'Recharts',
              'OpenAPI/Swagger',
            ].map((t) => (
              <Tech key={t} t={t} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cómo funciona</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Autenticación con GitHub y sesión guardada en Postgres (Better Auth + Prisma).
              </li>
              <li>
                RBAC: todos los usuarios nuevos se crean como <strong>ADMIN</strong> para pruebas.
              </li>
              <li>Movimientos: CRUD vía Next API Routes, validación en server y UI shadcn.</li>
              <li>Reportes: agregación por mes, saldo actual y descarga CSV.</li>
              <li>
                Swagger: documentación viva en <code>/api/docs</code>.
              </li>
            </ol>
            <div className="pt-3">
              <Button asChild size="sm" variant="secondary">
                <a href="/api/docs">Ver API Docs</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
