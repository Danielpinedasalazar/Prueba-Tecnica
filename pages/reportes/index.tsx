import { requireRole } from '@/lib/rbac';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReloadIcon } from '@radix-ui/react-icons';
import { BarChart2, Download, TrendingDown, TrendingUp } from 'lucide-react';

const ReportChart = dynamic(() => import('@/components/report-chart'), {
  ssr: false,
});

type Serie = { month: string; income: number; expense: number; net: number };

export const getServerSideProps: GetServerSideProps = (ctx) => requireRole(ctx, ['ADMIN']);

const fmtMoney = (v: number, currency = 'USD') =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(v) ? v : 0);

export default function ReportesPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/reportes', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setBalance(Number(json.balance) || 0);
        setSeries((json.series as Serie[]) ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const { totalIncome, totalExpense, months } = useMemo(() => {
    const inc = series.reduce((s, x) => s + (x.income || 0), 0);
    const exp = series.reduce((s, x) => s + (x.expense || 0), 0);
    return { totalIncome: inc, totalExpense: exp, months: series.length };
  }, [series]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">
          Agregados mensuales y saldo actual. Exporta a CSV para análisis.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={load} disabled={loading}>
                {loading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando…
                  </>
                ) : (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4" />
                    Refrescar
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Vuelve a consultar los datos del servidor</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button asChild>
          <a href="/api/reportes/csv">
            <Download className="mr-2 h-4 w-4" />
            Descargar CSV
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/70">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Saldo actual</CardTitle>
            <CardDescription>Acumulado de todos los movimientos</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div
              className={[
                'text-3xl font-semibold tabular-nums',
                balance >= 0 ? 'text-emerald-500' : 'text-red-500',
              ].join(' ')}
            >
              {fmtMoney(balance)}
            </div>
            <Badge variant="secondary" className="uppercase">
              {balance >= 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3.5 w-3.5" /> Positivo
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3.5 w-3.5" /> Negativo
                </>
              )}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Ingresos</CardTitle>
            <CardDescription>Sumatoria del período</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold tabular-nums text-emerald-500">
              {fmtMoney(totalIncome)}
            </div>
            <Badge variant="secondary" className="uppercase">
              {months || 0} {months === 1 ? 'mes' : 'meses'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Egresos</CardTitle>
            <CardDescription>Sumatoria del período</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold tabular-nums text-red-500">
              -{fmtMoney(totalExpense)}
            </div>
            <Badge variant="secondary" className="uppercase">
              Detalle
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <Card className="bg-card/70">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Ingresos vs Egresos por mes
          </CardTitle>
          <CardDescription>
            Comparativo mensual de flujos. Pasa el cursor para ver valores exactos y saldo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && series.length === 0 ? (
            <div className="h-[360px] rounded-lg border bg-muted/40 animate-pulse" />
          ) : series.length === 0 ? (
            <div className="h-[220px] flex flex-col items-center justify-center rounded-lg border text-sm text-muted-foreground">
              No hay datos suficientes para graficar.
              <Separator className="my-3 w-40" />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={load}>
                  Refrescar
                </Button>
                <Button asChild size="sm">
                  <a href="/movimientos">Agregar movimientos</a>
                </Button>
              </div>
            </div>
          ) : (
            <ReportChart data={series} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
