import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
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
          <p className="text-xs text-muted-foreground">
            Usamos Better Auth con GitHub como proveedor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
