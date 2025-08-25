// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TooltipProvider } from '@/components/ui/tooltip';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TooltipProvider delayDuration={150}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="container-page py-8 flex-1">
            <Component key={router.asPath} {...pageProps} />
          </main>

          <SiteFooter />
        </div>
      </TooltipProvider>
    </>
  );
}
