import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from '@vercel/analytics/next';
import { StatsBeacon } from '@/components/StatsBeacon';
import { CountryMemory } from '@/components/CountryMemory';
import { getLocale, getMessages } from 'next-intl/server';
import { COUNTRIES } from '@opencaribe/configuration';
import { SiteHeader } from '@/components/SiteHeader';
import { getCurrentUser } from '@/lib/session';
import { SiteFooter } from '@/components/SiteFooter';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'OpenCaribe — The marketplace built for our islands',
    template: '%s · OpenCaribe',
  },
  description:
    'An open-source, privacy-first classifieds marketplace for Trinidad and Tobago and Venezuela.',
  applicationName: 'OpenCaribe',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e1d31',
};

const themeScript = `try{var t=localStorage.getItem('opencaribe-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const viewer = await getCurrentUser();
  const walletConnect = COUNTRIES.TT.cryptoPayments.walletConnect;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {walletConnect.enabled && (
          <>
            <meta name="gnoconnect:rpc" content={walletConnect.rpcUrl} />
            <meta name="gnoconnect:chainid" content={walletConnect.chainId} />
            <meta name="gnoconnect:txdomains" content="auto,gno.land" />
          </>
        )}
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader userName={viewer?.name ?? null} userRole={viewer?.role ?? null} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
            <Analytics />
      <StatsBeacon />
      <CountryMemory />
    </body>
    </html>
  );
}
