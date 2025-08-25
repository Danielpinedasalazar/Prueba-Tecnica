// lib/rbac.ts
import { auth } from '@/lib/auth';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export type Role = 'ADMIN' | 'USER';

export function canAccess(required: Role | Role[], userRole: Role): boolean {
  const list = Array.isArray(required) ? required : [required];
  return list.includes(userRole);
}

export async function requireRole<TProps = Record<string, unknown>>(
  ctx: GetServerSidePropsContext,
  required: Role | Role[]
): Promise<GetServerSidePropsResult<TProps>> {
  const headers = new Headers(ctx.req.headers as unknown as Record<string, string>);

  const res = await auth.api.getSession({ headers });

  const user = res?.user ?? null;
  const role = (user as unknown as { role?: Role } | null)?.role ?? 'USER';

  if (!canAccess(required, role)) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: {} as TProps };
}
