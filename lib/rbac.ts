import { auth } from '@/lib/auth';
import type { GetServerSidePropsContext } from 'next';

type Role = 'ADMIN' | 'USER';

export async function requireRole(ctx: GetServerSidePropsContext, roles: Role[]) {
  const session = await auth.api.getSession({ headers: ctx.req.headers as any });
  if (!session) {
    return { redirect: { destination: '/auth/login', permanent: false } };
  }
  const role = (session.user as any).role as Role;
  if (!roles.includes(role)) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
}
