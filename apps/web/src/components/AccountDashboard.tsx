import { Container, Card, SectionTitle, Badge } from '@opencaribe/ui';
import { LinkButton } from '@/components/LinkButton';
import { LogoutButton } from '@/components/LogoutButton';
import { AccountWalletCard } from '@/components/AccountWalletCard';
import { OfferHistory } from '@/components/OfferHistory';
import { OversightPanel } from '@/components/OversightPanel';
import { ContactCard } from '@/components/ContactCard';
import { getCurrentUser } from '@/lib/session';
import { getSellerStats, listRatingsForSeller } from '@/lib/store';
import { listListingsBySeller } from '@/lib/listings-store';
import { formatMoney } from '@opencaribe/configuration';
import type { Locale } from '@opencaribe/configuration';
import { getLocale } from 'next-intl/server';
import { getT } from '@/lib/t';

/**
 * Member dashboard. With `countryCode` it scopes the listing table to one
 * market; without it (root /account) it shows every country the member posts in.
 */
export async function AccountDashboard({ countryCode }: { countryCode?: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Container className="max-w-md py-16">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('dashboard.title')}</h1>
        <Card className="mt-6 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">{t('messages.signInRequired')}</p>
          <LinkButton href="/login" className="mt-5 w-full">{t('nav.signIn')}</LinkButton>
        </Card>
      </Container>
    );
  }

  const sellerKey = `user:${user.id}`;
  const [listings, stats, ratings] = await Promise.all([
    listListingsBySeller(sellerKey),
    getSellerStats(sellerKey),
    listRatingsForSeller(sellerKey),
  ]);
  const visible = countryCode ? listings.filter((listing) => listing.countryCode === countryCode) : listings;

  return (
    <Container className="max-w-4xl py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionTitle>{t('dashboard.title')}</SectionTitle>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {user.name} · {user.email}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.memberSince', { date: new Date(user.createdAt).toLocaleDateString() })}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.wallet')}:{' '}
            {user.walletAddress
              ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}`
              : t('dashboard.noWallet')}
          </p>
        </div>
        <LogoutButton />
      </div>

      <AccountWalletCard linkedAddress={user.walletAddress} />
      <ContactCard whatsapp={user.whatsapp} />

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('dashboard.myListings')}</h2>
          <LinkButton href={countryCode ? `/${countryCode.toLowerCase()}/post` : '/post'} size="sm">{t('nav.post')}</LinkButton>
        </div>
        {stats.count > 0 && (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            ★ {stats.average.toFixed(1)} · {t('dashboard.average')} ({stats.count})
          </p>
        )}
        <div className="mt-4 grid gap-3">
          {visible.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <LinkButton href={`/${listing.countryCode.toLowerCase()}/l/${listing.id}`} size="sm">
                  {listing.title}
                </LinkButton>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {listing.countryCode} · {formatMoney(listing.amountMinor, listing.currency, locale)}
                </p>
              </div>
              <Badge tone={listing.status === 'active' ? 'success' : 'warning'}>{listing.status}</Badge>
            </div>
          ))}
          {visible.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t('dashboard.noListings')}</p>}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('dashboard.reviewsTitle')}</h2>
        <div className="mt-4 grid gap-3">
          {ratings.map((rating) => (
            <div key={rating.id} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">★ {rating.score}/5</p>
              {rating.comment && <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{rating.comment}</p>}
              <p className="mt-1 text-xs text-slate-500">{new Date(rating.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {ratings.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t('dashboard.noReviews')}</p>}
        </div>
      </Card>
      <OfferHistory />
      {user.role === 'admin' || user.role === 'moderator' ? <OversightPanel role={user.role} /> : null}
    </Container>
  );
}
