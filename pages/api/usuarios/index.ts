import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const putSchema = z
  .object({
    id: z.string().min(1, 'id requerido'),
    name: z.string().trim().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
    phone: z.string().trim().optional().nullable(),
  })
  .refine((v) => v.name !== undefined || v.role !== undefined || v.phone !== undefined, {
    message: 'Debe enviar al menos un campo a actualizar: name, role o phone',
  });

function toWebHeaders(req: NextApiRequest): Headers {
  const h = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) h.set(key, value.join(','));
    else if (value != null) h.set(key, String(value));
  }
  return h;
}

async function requireAdmin(req: NextApiRequest) {
  const result = await auth.api.getSession({ headers: toWebHeaders(req) });
  const role = (result?.user as any)?.role ?? 'USER';
  return { isAuth: !!result?.user, isAdmin: role === 'ADMIN', session: result?.session };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      return res.status(200).json(users);
    } catch (e) {
      console.error('GET /api/usuarios error', e);
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { isAuth, isAdmin } = await requireAdmin(req);
      if (!isAuth) return res.status(401).json({ error: 'unauthorized' });
      if (!isAdmin) return res.status(403).json({ error: 'forbidden' });

      const parsed = putSchema.parse(req.body);

      const data: Record<string, unknown> = {};
      if (parsed.name !== undefined) data.name = parsed.name;
      if (parsed.role !== undefined) data.role = parsed.role;
      if (parsed.phone !== undefined) data.phone = parsed.phone;

      const updated = await prisma.user.update({
        where: { id: parsed.id },
        data,
        select: { id: true, name: true, email: true, phone: true, role: true },
      });

      return res.status(200).json(updated);
    } catch (e: any) {
      console.error('PUT /api/usuarios error', e);
      if (e?.name === 'ZodError') {
        return res.status(400).json({ error: 'validation_error', details: e.flatten() });
      }
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'method_not_allowed' });
}
