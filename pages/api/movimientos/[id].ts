// pages/api/movimientos/[id].ts
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const putSchema = z
  .object({
    concept: z.string().min(1).optional(),
    amount: z.number().optional(),
    date: z
      .string()
      .refine((v) => (v ? !Number.isNaN(Date.parse(v)) : true), 'fecha inválida')
      .optional(),
  })
  .refine((v) => v.concept !== undefined || v.amount !== undefined || v.date !== undefined, {
    message: 'Debe enviar al menos un campo a actualizar',
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isAdmin, session } = await requireAdmin(req);
  if (!session) return res.status(401).json({ error: 'unauthorized' });
  if (!isAdmin) return res.status(403).json({ error: 'forbidden' });

  const id = req.query.id as string;

  if (req.method === 'PUT') {
    try {
      const parsed = putSchema.parse(
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      );
      const data: { concept?: string; amount?: number; date?: Date } = {};
      if (parsed.concept !== undefined) data.concept = parsed.concept;
      if (parsed.amount !== undefined) data.amount = parsed.amount;
      if (parsed.date !== undefined) data.date = new Date(parsed.date);

      const updated = await prisma.movement.update({
        where: { id },
        data,
        select: {
          id: true,
          concept: true,
          amount: true,
          date: true,
          user: { select: { name: true, email: true } },
        },
      });
      return res.status(200).json(updated);
    } catch (e) {
      if (e instanceof z.ZodError)
        return res.status(400).json({ error: 'validation_error', details: e.flatten() });
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.movement.delete({ where: { id } });
      return res.status(204).end();
    } catch {
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  res.setHeader('Allow', 'PUT, DELETE');
  return res.status(405).json({ error: 'method_not_allowed' });
}
