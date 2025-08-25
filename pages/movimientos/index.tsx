'use client';

import { authClient } from '@/lib/auth-client';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Pencil, Plus, Trash2, Wallet } from 'lucide-react';

type Movement = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: { name: string | null; email: string };
};

const fmtMoney = (v: number, currency = 'USD') =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(v || 0));

export default function MovimientosPage() {
  const { data: session, isPending } = authClient.useSession();

  const [data, setData] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ concept: '', amount: '', date: '' });
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME'); // <-- selector

  const isAdmin = useMemo(() => (session?.user as any)?.role === 'ADMIN', [session]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/movimientos', { cache: 'no-store' });
      if (res.ok) {
        const json = (await res.json()) as Movement[];
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    let amt = Number(form.amount);
    if (!Number.isFinite(amt)) amt = 0;
    amt = type === 'EXPENSE' ? -Math.abs(amt) : Math.abs(amt);

    const payload = { concept: form.concept, amount: amt, date: form.date };
    const url = editId ? `/api/movimientos/${editId}` : '/api/movimientos';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert('Error al guardar');
      return;
    }
    const saved = (await res.json()) as Movement;

    if (editId) {
      setData((d) => d.map((m) => (m.id === saved.id ? saved : m)));
    } else {
      setData((d) => [saved, ...d]);
    }
    setOpen(false);
    setEditId(null);
    setForm({ concept: '', amount: '', date: '' });
    setType('INCOME');
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar movimiento?')) return;
    const res = await fetch(`/api/movimientos/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      setData((d) => d.filter((m) => m.id !== id));
    }
  }

  // Métricas derivadas (solo UI)
  const { income, expense, balance } = useMemo(() => {
    const inc = data.reduce((s, m) => (m.amount > 0 ? s + m.amount : s), 0);
    const exp = data.reduce((s, m) => (m.amount < 0 ? s + Math.abs(m.amount) : s), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [data]);

  if (isPending) return <p className="p-6">Cargando…</p>;
  if (!session) return <p className="p-6">Inicia sesión primero</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="page-title">Movimientos</h1>
        <p className="page-subtitle">Registra ingresos y egresos con un selector de tipo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ingresos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold text-emerald-500">{fmtMoney(income)}</div>
            <Badge variant="secondary" className="uppercase">
              Total
            </Badge>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Egresos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold text-red-500">-{fmtMoney(expense)}</div>
            <Badge variant="secondary" className="uppercase">
              Total
            </Badge>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Saldo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div
              className={[
                'text-2xl font-semibold',
                balance >= 0 ? 'text-emerald-500' : 'text-red-500',
              ].join(' ')}
            >
              {fmtMoney(balance)}
            </div>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/70">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Listado</CardTitle>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={load} disabled={loading}>
                      {loading ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Actualizando…
                        </>
                      ) : (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4" />
                          Refrescar
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Vuelve a consultar los datos</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {isAdmin && (
                <Dialog
                  open={open}
                  onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) {
                      setEditId(null);
                      setForm({ concept: '', amount: '', date: '' });
                      setType('INCOME');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editId ? 'Editar movimiento' : 'Nuevo movimiento'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="grid gap-4 pt-2">
                      {/* Selector de tipo */}
                      <div className="grid gap-2">
                        <Label>Tipo</Label>
                        <div className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={type === 'INCOME' ? 'default' : 'ghost'}
                            onClick={() => setType('INCOME')}
                          >
                            Ingreso
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={type === 'EXPENSE' ? 'destructive' : 'ghost'}
                            onClick={() => setType('EXPENSE')}
                          >
                            Egreso
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          El monto se firmará automáticamente según el tipo.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="concept">Concepto</Label>
                        <Input
                          id="concept"
                          value={form.concept}
                          onChange={(e) => setForm((f) => ({ ...f, concept: e.target.value }))}
                          placeholder="Ej. Nómina, Compra insumos…"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="amount">Monto</Label>
                        <Input
                          id="amount"
                          type="number"
                          inputMode="decimal"
                          value={form.amount}
                          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                          placeholder={
                            type === 'EXPENSE'
                              ? 'Ej. 1250.00 (se registrará como egreso)'
                              : 'Ej. 1250.00'
                          }
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                          required
                        />
                      </div>

                      <DialogFooter className="gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setOpen(false);
                            setEditId(null);
                            setForm({ concept: '', amount: '', date: '' });
                            setType('INCOME');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="min-w-[140px]">Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading &&
                  data.length === 0 &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="ml-auto h-8 w-28 animate-pulse rounded bg-muted" />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                {!loading && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="py-10 text-center">
                      <div className="mx-auto max-w-sm space-y-2">
                        <p className="text-sm text-muted-foreground">No hay movimientos aún.</p>
                        {isAdmin && (
                          <Button onClick={() => setOpen(true)} className="mt-1">
                            <Plus className="mr-2 h-4 w-4" />
                            Registrar el primero
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {data.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.concept}</TableCell>

                    <TableCell>
                      <span
                        className={[
                          'rounded px-2 py-1 text-sm',
                          m.amount >= 0
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500',
                        ].join(' ')}
                      >
                        {m.amount >= 0 ? '+' : ''}
                        {fmtMoney(m.amount)}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {new Date(m.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="max-w-[220px] truncate">
                      {m.user?.name ?? m.user?.email}
                    </TableCell>

                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    setEditId(m.id);
                                    setType(m.amount >= 0 ? 'INCOME' : 'EXPENSE');
                                    setForm({
                                      concept: m.concept,
                                      amount: String(Math.abs(m.amount)),
                                      date: new Date(m.date).toISOString().slice(0, 10),
                                    });
                                    setOpen(true);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar movimiento</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => onDelete(m.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Eliminar movimiento</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Tip: usa el selector para elegir el tipo. El sistema aplicará el signo automáticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
