import { authClient } from '@/lib/auth-client';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Movement = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: { name: string | null; email: string };
};

export default function MovimientosPage() {
  const { data: session, isPending } = authClient.useSession();

  const [data, setData] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ concept: '', amount: '', date: '' });

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
    const payload = {
      concept: form.concept,
      amount: Number(form.amount),
      date: form.date,
    };
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
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar movimiento?')) return;
    const res = await fetch(`/api/movimientos/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      setData((d) => d.filter((m) => m.id !== id));
    }
  }

  if (isPending) return <p className="p-6">Cargando…</p>;
  if (!session) return <p className="p-6">Inicia sesión primero</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="page-title">Movimientos</h1>
        <p className="page-subtitle">Registra ingresos (monto ≥ 0) y egresos (monto &lt; 0).</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Listado</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? 'Actualizando…' : 'Refrescar'}
            </Button>
            {isAdmin && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>Nuevo</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editId ? 'Editar movimiento' : 'Nuevo movimiento'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="concept">Concepto</Label>
                      <Input
                        id="concept"
                        value={form.concept}
                        onChange={(e) => setForm((f) => ({ ...f, concept: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
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
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setOpen(false);
                          setEditId(null);
                          setForm({ concept: '', amount: '', date: '' });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Guardar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center">
                    No hay movimientos aún
                  </TableCell>
                </TableRow>
              ) : (
                data.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.concept}</TableCell>
                    <TableCell className={m.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {m.amount >= 0 ? '+' : ''}${m.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(m.date).toLocaleDateString()}</TableCell>
                    <TableCell>{m.user?.name ?? m.user?.email}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditId(m.id);
                            setForm({
                              concept: m.concept,
                              amount: String(m.amount),
                              date: new Date(m.date).toISOString().slice(0, 10),
                            });
                            setOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(m.id)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
