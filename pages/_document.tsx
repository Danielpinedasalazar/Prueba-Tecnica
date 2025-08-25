// pages/_document.tsx
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es" className="bg-background" suppressHydrationWarning>
      <Head>
        {/* Fuente moderna de Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* SEO / Metatags básicos */}
        <meta name="description" content="Sistema de Ingresos y Gastos con Next.js + shadcn/ui" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        {/* Favicon y PWA */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
