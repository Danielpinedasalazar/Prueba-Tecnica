import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireRole } from '@/lib/rbac';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// wrapper dinámico de recharts
const ReportChart = dynamic(() => import('@/components/report-chart'), {
  ssr: false,
});

type Serie = { month: string; income: number; expense: number; net: number };

export const getServerSideProps: GetServerSideProps = (ctx) => requireRole(ctx, ['ADMIN']);

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
        setBalance(json.balance as number);
        setSeries(json.series as Serie[]);
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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">
          Agregados mensuales y saldo actual. Exporta a CSV para análisis.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading ? 'Actualizando…' : 'Refrescar'}
        </Button>
        <Button asChild>
          <a href="/api/reportes/csv">Descargar CSV</a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saldo actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              $
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ingresos vs Egresos por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportChart data={series} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
