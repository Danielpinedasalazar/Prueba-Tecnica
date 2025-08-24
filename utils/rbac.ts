export type Role = 'ADMIN' | 'USER';
export const canAccess = (need: Role[], have: Role) => need.includes(have);
