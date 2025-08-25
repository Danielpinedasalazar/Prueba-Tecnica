import { computeReport } from '@/utils/report';
import { describe, expect, it } from 'vitest';

describe('computeReport', () => {
  it('calcula balance y series por mes', () => {
    const { balance, series } = computeReport([
      { amount: 100, date: '2025-01-10' },
      { amount: -30, date: '2025-01-12' },
      { amount: 70, date: '2025-02-01' },
    ]);
    expect(balance).toBe(140);
    expect(series).toEqual([
      { month: '2025-01', income: 100, expense: 30, net: 70 },
      { month: '2025-02', income: 70, expense: 0, net: 70 },
    ]);
  });
});
