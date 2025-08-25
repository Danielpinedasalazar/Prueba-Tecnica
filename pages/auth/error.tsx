export default function AuthErrorPage() {
  return (
    <main className="container-page py-12">
      <h1 className="text-2xl font-semibold">Error de autenticación</h1>
      <p className="mt-2 text-muted-foreground">
        Ocurrió un problema al iniciar sesión. Intenta nuevamente.
      </p>
    </main>
  );
}
