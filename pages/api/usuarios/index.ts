import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session) return res.status(401).json({ error: 'Unauthenticated' });

  const role = (session.user as any).role as 'ADMIN' | 'USER';
  if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  try {
    if (req.method === 'GET') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      return res.json(users);
    }

    if (req.method === 'PUT') {
      const { id, name, role, phone } = req.body as {
        id: string;
        name?: string;
        role?: 'ADMIN' | 'USER';
        phone?: string | null;
      };
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const updated = await prisma.user.update({
        where: { id },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(role !== undefined ? { role } : {}),
          ...(phone !== undefined ? { phone } : {}),
        },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      return res.json(updated);
    }

    res.setHeader('Allow', 'GET,PUT');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
