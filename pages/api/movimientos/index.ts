// pages/api/movimientos/index.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const postSchema = z.object({
  concept: z.string().min(1, 'concept requerido'),
  amount: z.number(),
  date: z
    .string()
    .min(1, 'date requerido')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'fecha inválida'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionInfo = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });
  const session = sessionInfo?.session ?? null;

  if (req.method === 'GET') {
    if (!session) return res.status(401).json({ error: 'unauthorized' });
    try {
      const rows = await prisma.movement.findMany({
        orderBy: { date: 'desc' },
        select: {
          id: true,
          concept: true,
          amount: true,
          date: true,
          user: { select: { name: true, email: true } },
        },
      });
      return res.status(200).json(rows);
    } catch {
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  if (req.method === 'POST') {
    // Solo ADMIN crea
    const { isAdmin, session: s } = await requireAdmin(req);
    if (!s) return res.status(401).json({ error: 'unauthorized' });
    if (!isAdmin) return res.status(403).json({ error: 'forbidden' });

    try {
      const parsed = postSchema.parse(
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      );
      const created = await prisma.movement.create({
        data: {
          concept: parsed.concept,
          amount: parsed.amount,
          date: new Date(parsed.date),
          userId: sessionInfo!.user.id,
        },
        select: {
          id: true,
          concept: true,
          amount: true,
          date: true,
          user: { select: { name: true, email: true } },
        },
      });
      return res.status(201).json(created);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ error: 'validation_error', details: e.flatten() });
      }
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method_not_allowed' });
}
