import { escapeCsv } from '@/utils/csv';
import { describe, expect, it } from 'vitest';

describe('escapeCsv', () => {
  it('escapa comillas y comas', () => {
    expect(escapeCsv('Hola, "mundo"')).toBe('"Hola, ""mundo"""');
    expect(escapeCsv('simple')).toBe('simple');
  });
});
