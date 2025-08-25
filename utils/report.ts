type Item = { amount: number; date: string };

function monthKey(d: string): string {
  if (/^\d{4}-\d{2}-/.test(d)) return d.slice(0, 7);
  const dd = new Date(d);
  const y = dd.getUTCFullYear();
  const m = String(dd.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function computeReport(items: Item[]) {
  let balance = 0;
  const map = new Map<string, { month: string; income: number; expense: number; net: number }>();

  for (const it of items) {
    const amt = Number(it.amount) || 0;
    balance += amt;

    const key = monthKey(it.date);
    if (!map.has(key)) {
      map.set(key, { month: key, income: 0, expense: 0, net: 0 });
    }
    const acc = map.get(key)!;

    if (amt >= 0) acc.income += amt;
    else acc.expense += Math.abs(amt);

    acc.net = acc.income - acc.expense;
  }

  const series = Array.from(map.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
  return { balance, series };
}
