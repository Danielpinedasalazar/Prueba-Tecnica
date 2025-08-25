// pages/api/usuarios/index.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

type Role = 'USER' | 'ADMIN';

// ── Validators
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: listado de usuarios
  if (req.method === 'GET') {
    try {
      const result = await auth.api.getSession({
        headers: new Headers(req.headers as Record<string, string>),
      });
      const session = result?.session ?? null;
      const role = ((result?.user as unknown as { role?: Role })?.role ?? 'USER') as Role;

      if (!session) return res.status(401).json({ error: 'unauthorized' });
      if (role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' });

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

  // PUT: actualizar name/role/phone (solo ADMIN)
  if (req.method === 'PUT') {
    try {
      const { isAuth, isAdmin } = await requireAdmin(req);
      if (!isAuth) return res.status(401).json({ error: 'unauthorized' });
      if (!isAdmin) return res.status(403).json({ error: 'forbidden' });

      const parsed = putSchema.parse(
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      );

      const data: {
        name?: string;
        role?: Role;
        phone?: string | null;
      } = {};
      if (parsed.name !== undefined) data.name = parsed.name;
      if (parsed.role !== undefined) data.role = parsed.role;
      if (parsed.phone !== undefined) data.phone = parsed.phone;

      const updated = await prisma.user.update({
        where: { id: parsed.id },
        data,
        select: { id: true, name: true, email: true, phone: true, role: true },
      });

      return res.status(200).json(updated);
    } catch (e) {
      console.error('PUT /api/usuarios error', e);
      if (e instanceof z.ZodError) {
        return res.status(400).json({ error: 'validation_error', details: e.flatten() });
      }
      return res.status(500).json({ error: 'internal_error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'method_not_allowed' });
}
