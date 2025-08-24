import Link from 'next/link';

export default function AuthErrorPage({ query }: any) {
  const error = query?.error ?? 'unknown';
  const msg =
    error === 'account_not_linked'
      ? 'Esta cuenta ya está vinculada a otro método de inicio de sesión.'
      : error === 'state_not_found'
        ? 'No se encontró el estado de autenticación. Intenta de nuevo.'
        : 'Ocurrió un error. Intenta nuevamente.';

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="max-w-lg p-6 border rounded-2xl space-y-4">
        <h1 className="text-2xl font-bold">Login Error</h1>
        <p className="text-destructive">{msg}</p>
        <Link href="/auth/login" className="underline">
          Volver a Login
        </Link>
      </div>
    </div>
  );
}

AuthErrorPage.getInitialProps = ({ query }: any) => ({ query });
