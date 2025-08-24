import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session) return res.status(401).json({ error: 'Unauthenticated' });

  const role = (session.user as any).role as 'ADMIN' | 'USER';
  if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  const { id } = req.query as { id: string };

  try {
    if (req.method === 'PUT') {
      const { concept, amount, date } = req.body as {
        concept?: string;
        amount?: number | string;
        date?: string;
      };
      const updated = await prisma.movement.update({
        where: { id },
        data: {
          ...(concept !== undefined ? { concept } : {}),
          ...(amount !== undefined ? { amount: Number(amount) } : {}),
          ...(date !== undefined ? { date: new Date(date) } : {}),
        },
        include: { user: { select: { name: true, email: true } } },
      });
      return res.json(updated);
    }

    if (req.method === 'DELETE') {
      await prisma.movement.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', 'PUT,DELETE');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
