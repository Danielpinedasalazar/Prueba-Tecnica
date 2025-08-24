import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function Me() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <p>Cargando…</p>;
  if (!session) return <p>No hay sesión.</p>;

  const role = (session.user as any).role ?? 'USER';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{session.user.name}</span>
          <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>{role}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">{session.user.email}</div>
        <pre className="bg-secondary/50 rounded p-3 text-xs overflow-auto">
          {JSON.stringify(session.user, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
