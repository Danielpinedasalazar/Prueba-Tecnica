import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session) return res.status(401).json({ error: 'Unauthenticated' });

  const userId = session.user.id as string;
  const role = (session.user as any).role as 'ADMIN' | 'USER';

  try {
    if (req.method === 'GET') {
      // Lista todos los movimientos (requisito: visibles para ambos roles)
      const data = await prisma.movement.findMany({
        orderBy: { date: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      });
      return res.json(data);
    }

    if (req.method === 'POST') {
      if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

      const { concept, amount, date } = req.body as {
        concept: string;
        amount: number;
        date: string;
      };
      if (!concept || !Number.isFinite(Number(amount)) || !date) {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      const created = await prisma.movement.create({
        data: {
          concept,
          amount: Number(amount),
          date: new Date(date),
          userId,
        },
        include: { user: { select: { name: true, email: true } } },
      });
      return res.status(201).json(created);
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
