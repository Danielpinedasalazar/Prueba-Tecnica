import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Serie = { month: string; income: number; expense: number; net: number };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session) return res.status(401).json({ error: 'Unauthenticated' });

  const role = (session.user as any).role as 'ADMIN' | 'USER';
  if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const movements = await prisma.movement.findMany({
    orderBy: { date: 'asc' },
    select: { amount: true, date: true },
  });

  const balance = movements.reduce((acc, m) => acc + m.amount, 0);

  const map = new Map<string, Serie>();
  for (const m of movements) {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const entry = map.get(key) || { month: key, income: 0, expense: 0, net: 0 };
    if (m.amount >= 0) entry.income += m.amount;
    else entry.expense += Math.abs(m.amount);
    entry.net = entry.income - entry.expense;
    map.set(key, entry);
  }
  const series = Array.from(map.values());

  return res.json({ balance, series });
}
