'use client';

import { authClient } from '@/lib/auth-client';
import { requireRole } from '@/lib/rbac';
import type { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Check, Edit2, Shield, UserRoundCog } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Role = 'USER' | 'ADMIN';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  phone?: string | null;
};

export const getServerSideProps: GetServerSideProps = (ctx) => requireRole(ctx, ['ADMIN']);

export default function UsuariosPage() {
  const { data: session } = authClient.useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState('');

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u.name ?? '').toLowerCase();
      const phone = (u.phone ?? '').toLowerCase();
      return u.email.toLowerCase().includes(q) || name.includes(q) || phone.includes(q);
    });
  }, [users, term]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<{ name: string; role: Role; phone: string }>({
    name: '',
    role: 'USER',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios', { cache: 'no-store' });
      if (res.ok) {
        setUsers(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateRole(id: string, role: Role) {
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    const res = await fetch('/api/usuarios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    if (!res.ok) {
      setUsers((u) =>
        u.map((x) => (x.id === id ? { ...x, role: x.role === 'ADMIN' ? 'USER' : 'ADMIN' } : x))
      );
      alert('No se pudo actualizar el rol');
    }
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({
      name: u.name ?? '',
      role: u.role,
      phone: u.phone ?? '',
    });
    setOpen(true);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const body = {
        id: editing.id,
        name: form.name.trim(),
        role: form.role,
        phone: form.phone.trim() || null,
      };
      const res = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        alert('No se pudo guardar los cambios');
        return;
      }
      setUsers((list) =>
        list.map((u) =>
          u.id === editing.id ? { ...u, name: body.name, role: body.role, phone: body.phone } : u
        )
      );
      setOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  if (!session) return <p className="p-6">Inicia sesión primero</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="page-title">Usuarios</h1>
        <p className="page-subtitle">
          Solo administradores. Edita <strong>nombre</strong>, <strong>rol</strong> y{' '}
          <strong>teléfono</strong> de cada usuario.
        </p>
      </div>

      <Card className="bg-card/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserRoundCog className="h-5 w-5 text-primary" />
            Gestión de usuarios
          </CardTitle>
          <CardDescription>Cambia roles y edita datos de perfil.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Buscar por nombre, correo o teléfono…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full sm:w-[320px]"
            />
          </div>
          <div className="flex items-center gap-2">
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
                <TooltipContent>Vuelve a consultar el listado</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && users.length === 0 && (
                  <>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-52 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="ml-auto h-8 w-40 bg-muted rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}

                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No hay resultados. Ajusta tu búsqueda o refresca el listado.
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {(u.name ?? u.email)?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <div className="font-medium">{u.name ?? '—'}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[240px] sm:max-w-none">
                            {u.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="align-middle">{u.email}</TableCell>

                    <TableCell className="align-middle">{u.phone ?? '—'}</TableCell>

                    <TableCell className="align-middle">
                      <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        {u.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Dialog open={open && editing?.id === u.id} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="secondary" onClick={() => openEdit(u)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Editar
                                  </Button>
                                </DialogTrigger>

                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar usuario</DialogTitle>
                                  </DialogHeader>

                                  <form onSubmit={saveEdit} className="grid gap-4 pt-2">
                                    <div className="grid gap-2">
                                      <Label htmlFor="name">Nombre</Label>
                                      <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) =>
                                          setForm((f) => ({ ...f, name: e.target.value }))
                                        }
                                        placeholder="Nombre completo"
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label>Rol</Label>
                                      <Select
                                        value={form.role}
                                        onValueChange={(val) =>
                                          setForm((f) => ({ ...f, role: val as Role }))
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="USER">USER</SelectItem>
                                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="phone">Teléfono (opcional)</Label>
                                      <Input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                          setForm((f) => ({ ...f, phone: e.target.value }))
                                        }
                                        placeholder="+57 300 000 0000"
                                      />
                                    </div>

                                    <DialogFooter className="gap-2">
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                          setOpen(false);
                                          setEditing(null);
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button type="submit" disabled={saving}>
                                        {saving ? 'Guardando…' : 'Guardar'}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>Editar nombre, rol y teléfono</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')
                                }
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Aplicar
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Alternar rol rápidamente</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
