import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

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
    include: { user: { select: { name: true, email: true } } },
  });

  const header = ['concept', 'amount', 'date', 'user_name', 'user_email'].join(',');
  const rows = movements.map((m) =>
    [
      escapeCsv(m.concept),
      m.amount.toString(),
      new Date(m.date).toISOString(),
      escapeCsv(m.user?.name ?? ''),
      escapeCsv(m.user?.email ?? ''),
    ].join(',')
  );
  const csv = [header, ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="reporte_movimientos.csv"`);
  return res.status(200).send(csv);
}

function escapeCsv(value: string) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
