import { auth } from '@/lib/auth';
import type { NextApiRequest } from 'next';

export type Role = 'USER' | 'ADMIN';

export async function requireAdmin(req: NextApiRequest): Promise<{
  session: Exclude<Awaited<ReturnType<typeof auth.api.getSession>>, null>['session'] | null;
  role: Role;
  isAdmin: boolean;
  isAuth: boolean;
}> {
  const result = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });

  const session = result?.session ?? null;
  const role = ((result?.user as { role?: Role } | undefined)?.role ?? 'USER') as Role;

  return {
    session,
    role,
    isAdmin: role === 'ADMIN',
    isAuth: !!session,
  };
}
