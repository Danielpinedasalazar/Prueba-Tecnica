export type MovementLike = { amount: number; date: string | Date };

export function computeReport(movements: MovementLike[]) {
  const balance = movements.reduce((a, m) => a + Number(m.amount), 0);
  const map = new Map<string, { month: string; income: number; expense: number; net: number }>();
  for (const m of movements) {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const entry = map.get(key) || { month: key, income: 0, expense: 0, net: 0 };
    if (m.amount >= 0) entry.income += m.amount;
    else entry.expense += Math.abs(m.amount);
    entry.net = entry.income - entry.expense;
    map.set(key, entry);
  }
  return { balance, series: Array.from(map.values()) };
}
