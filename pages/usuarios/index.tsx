import { authClient } from '@/lib/auth-client';
import { requireRole } from '@/lib/rbac';
import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
};

export const getServerSideProps: GetServerSideProps = (ctx) => requireRole(ctx, ['ADMIN']);

export default function UsuariosPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<User[]>([]);

  async function load() {
    const res = await fetch('/api/usuarios');
    if (res.ok) setUsers(await res.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateRole(id: string, role: 'USER' | 'ADMIN') {
    const res = await fetch('/api/usuarios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) {
      setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    }
  }

  if (!session) return <p>Inicia sesión primero</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="page-title">Usuarios</h1>
        <p className="page-subtitle">Solo administradores. Edita nombre y rol de cada usuario.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback>{(u.name ?? u.email)[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {u.name ?? '—'}
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant={u.role === 'ADMIN' ? 'secondary' : 'default'}
                      onClick={() => updateRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                    >
                      {u.role === 'ADMIN' ? 'Hacer USER' : 'Hacer ADMIN'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
