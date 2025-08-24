import { auth } from '@/lib/auth';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type Role = 'ADMIN' | 'USER';

export function withApiAuth(handler: NextApiHandler, roles?: Role[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (!session) return res.status(401).json({ error: 'Unauthenticated' });

    if (roles && roles.length > 0) {
      const role = (session.user as any).role as Role;
      if (!roles.includes(role)) return res.status(403).json({ error: 'Forbidden' });
    }

    return handler(req, res);
  };
}
