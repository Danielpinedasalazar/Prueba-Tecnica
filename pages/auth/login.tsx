'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const goGithub = async () => {
    try {
      setLoading(true);
      window.location.assign('/api/auth/sign-in/github?callbackURL=/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            type="button"
            onClick={goGithub}
            disabled={loading}
            className="w-full cursor-pointer hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {loading ? 'Redirigiendo…' : 'Entrar con GitHub'}
          </Button>

          <p className="text-xs text-muted-foreground">
            Usamos Better Auth con GitHub como proveedor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
