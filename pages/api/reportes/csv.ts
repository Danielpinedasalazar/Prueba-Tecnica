// pages/api/reportes/csv.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { escapeCsv } from '@/utils/csv';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      select: {
        date: true,
        concept: true,
        amount: true,
        user: { select: { email: true, name: true } },
      },
    });

    const header = ['Fecha', 'Concepto', 'Monto', 'Usuario'].join(',');
    const body = rows
      .map((r) =>
        [
          new Date(r.date).toISOString().slice(0, 10),
          escapeCsv(r.concept),
          String(r.amount),
          escapeCsv(r.user?.name ?? r.user?.email ?? ''),
        ].join(',')
      )
      .join('\n');

    const csv = `${header}\n${body}\n`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.csv"');
    return res.status(200).send(csv);
  } catch {
    return res.status(500).json({ error: 'internal_error' });
  }
}
