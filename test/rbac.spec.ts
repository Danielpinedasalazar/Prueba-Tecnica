import { canAccess } from '@/utils/rbac';
import { describe, expect, it } from 'vitest';

describe('canAccess', () => {
  it('ADMIN puede acceder cuando se requiere ADMIN', () => {
    expect(canAccess(['ADMIN'], 'ADMIN')).toBe(true);
  });
  it('USER no puede acceder cuando se requiere ADMIN', () => {
    expect(canAccess(['ADMIN'], 'USER')).toBe(false);
  });
});
