export type Role = 'ADMIN' | 'USER';

export type UserWithRole = {
  role?: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type SessionLike = {
  user?: UserWithRole | null;
} | null;

export const getRole = (session: SessionLike): Role => (session?.user?.role ?? 'USER') as Role;
