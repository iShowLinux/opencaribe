import Link from 'next/link';
import { Container, SectionTitle } from '@opencaribe/ui';
import { getCurrentUser } from '@/lib/session';
import { getT } from '@/lib/t';
import { ShipQuoteForm } from '@/components/ShipQuoteForm';

export default async function ShippingPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; country?: string }>;
}) {
  const t = await getT();
  const user = await getCurrentUser();
  const { city = '', country = '' } = await searchParams;

  return (
    <Container className="max-w-3xl py-12">
      <SectionTitle>{t('title')}</SectionTitle>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('subtitle')}</p>

      <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/40">
        <p className="text-sm text-teal-900 dark:text-teal-100">{t('pirateNote')}</p>
        <Link
          href="https://www.pirateship.com/app/ship"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
        >
          {t('openPirate')} ↗
        </Link>
        {!user && <p className="mt-2 text-xs text-teal-800 dark:text-teal-200">{t('signInHint')}</p>}
      </div>

      <div className="mt-6">
        <ShipQuoteForm />
      </div>
      {city && <p className="mt-3 text-xs text-slate-500">{t('destinationContext', { city, country: country.toUpperCase() })}</p>}
    </Container>
  );
}
