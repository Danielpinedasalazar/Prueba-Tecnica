'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type Serie = { month: string; income: number; expense: number; net: number };

export default function ReportChart({ data }: { data: Serie[] }) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" name="Ingresos" />
          <Bar dataKey="expense" name="Egresos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
