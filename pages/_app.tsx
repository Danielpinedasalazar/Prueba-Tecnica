import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteHeader />
      <main className="container-page py-8">
        <Component {...pageProps} />
      </main>
      <SiteFooter />
    </>
  );
}
