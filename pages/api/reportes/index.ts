// pages/api/reportes/index.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

// util: compactar por mes
function monthKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });
  const session = result?.session ?? null;
  const role = ((result?.user as unknown as { role?: 'USER' | 'ADMIN' })?.role ?? 'USER') as
    | 'USER'
    | 'ADMIN';

  if (!session) return res.status(401).json({ error: 'unauthorized' });
  if (role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' });

  try {
    const rows = await prisma.movement.findMany({
      orderBy: { date: 'asc' },
      select: { amount: true, date: true },
    });

    const seriesMap = new Map<string, { income: number; expense: number }>();
    let balance = 0;

    for (const r of rows) {
      const d = new Date(r.date);
      const k = monthKey(d);
      const slot = seriesMap.get(k) ?? { income: 0, expense: 0 };
      if (r.amount >= 0) slot.income += r.amount;
      else slot.expense += Math.abs(r.amount);
      seriesMap.set(k, slot);
      balance += r.amount;
    }

    const series = [...seriesMap.entries()].map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
      net: income - expense,
    }));

    return res.status(200).json({ balance, series });
  } catch {
    return res.status(500).json({ error: 'internal_error' });
  }
}
