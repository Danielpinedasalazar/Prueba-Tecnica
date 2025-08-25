'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type Serie = { month: string; income: number; expense: number; net: number };

type Props = {
  data: Serie[];
  currency?: string;
  title?: string;
};

const nf = (currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 });

const COLORS = {
  income: '#10b981',
  incomeHi: '#34d399',
  expense: '#ef4444',
  expenseHi: '#f87171',
  net: '#6366f1',
};

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;

  const income = payload.find((p) => p.dataKey === 'income')?.value ?? 0;
  const expense = payload.find((p) => p.dataKey === 'expense')?.value ?? 0;
  const net = income - expense;

  return (
    <div className="rounded-lg border bg-popover/95 p-3 text-xs shadow-xl backdrop-blur">
      <div className="mb-2 font-medium">{label}</div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS.income }} />
            Ingresos
          </span>
          <span className="tabular-nums">{nf(currency).format(income)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS.expense }} />
            Egresos
          </span>
          <span className="tabular-nums">{nf(currency).format(expense)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-6 border-t pt-2">
          <span>Saldo</span>
          <span className={`tabular-nums ${net >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {nf(currency).format(net)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ReportChart({ data, currency = 'USD', title }: Props) {
  const max = React.useMemo(
    () => Math.max(...data.map((d) => Math.max(d.income, d.expense, 0)), 0),
    [data]
  );
  const domain: [number, number] = [0, Math.ceil(max * 1.15)];

  return (
    <div className="rounded-xl border bg-card/70 p-4 shadow-sm">
      {title ? <div className="mb-2 text-sm font-medium text-muted-foreground">{title}</div> : null}
      <div style={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 48, right: 16, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.incomeHi} stopOpacity={1} />
                <stop offset="100%" stopColor={COLORS.income} stopOpacity={1} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.expenseHi} stopOpacity={1} />
                <stop offset="100%" stopColor={COLORS.expense} stopOpacity={1} />
              </linearGradient>
              <pattern id="expensePattern" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="6" height="6" fill="url(#expenseGrad)" />
                <path d="M0 6 L6 0" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
              </pattern>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={domain}
              tickFormatter={(v) => nf(currency).format(v as number)}
              width={72}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />

            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={<ChartTooltip currency={currency} />}
              wrapperStyle={{ zIndex: 1 }}
            />

            <ReferenceLine y={0} stroke="hsl(var(--border))" />

            <Bar
              dataKey="income"
              name="Ingresos"
              fill="url(#incomeGrad)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expense"
              name="Egresos"
              fill="url(#expenseGrad)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
