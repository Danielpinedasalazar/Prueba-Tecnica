// pages/me.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';

export default function Me() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              <div className="h-3 w-52 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="h-24 w-full bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">No hay sesión iniciada.</p>
          <Button
            onClick={() =>
              authClient.signIn.social({
                provider: 'github',
                callbackURL: '/',
                errorCallbackURL: '/auth/error',
              })
            }
          >
            Entrar con GitHub
          </Button>
        </CardContent>
      </Card>
    );
  }

  const user = session.user;
  const role = (user as any)?.role ?? 'USER';
  const initials = (user.name ?? user.email ?? 'U').slice(0, 2).toUpperCase();

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{user.name ?? 'Usuario'}</span>
                <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>{role}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(user.email ?? '')}
              className="justify-start"
            >
              Copiar correo
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copy(user.id)}
              className="justify-start"
            >
              Copiar ID de usuario
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => authClient.signOut({ query: { callbackURL: '/' } })}
              className="justify-start"
            >
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalles</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Nombre</p>
              <p className="font-medium">{user.name ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Correo</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Verificado</p>
              <p className="font-medium">{user.emailVerified ? 'Sí' : 'No'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Creado</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Actualizado</p>
              <p className="font-medium">{new Date(user.updatedAt).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">ID</p>
              <p className="font-mono text-xs break-all">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payload de usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-secondary/50 rounded p-3 text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
