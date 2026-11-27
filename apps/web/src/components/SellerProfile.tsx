import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@opencaribe/configuration';
import { formatMoney } from '@opencaribe/configuration';
import { Badge, Container, SectionTitle } from '@opencaribe/ui';
import { getUserById, getSellerStats, listRatingsForSeller } from '@/lib/store';
import { listListingsBySeller } from '@/lib/listings-store';
import { getT } from '@/lib/t';

/** Public seller profile. `countryCode` limits the listings shown to one market. */
export async function SellerProfile({ userId, countryCode }: { userId: string; countryCode?: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const seller = await getUserById(userId);
  if (!seller) notFound();

  const sellerKey = `user:${userId}`;
  const [stats, ratings, listings] = await Promise.all([
    getSellerStats(sellerKey),
    listRatingsForSeller(sellerKey),
    listListingsBySeller(sellerKey),
  ]);
  let activeListings = listings.filter((listing) => listing.status === 'active');
  if (countryCode) activeListings = activeListings.filter((listing) => listing.countryCode === countryCode);
  const reviewers = await Promise.all(ratings.map((rating) => getUserById(rating.reviewerId)));

  return (
    <Container className="max-w-4xl py-12">
      <Link href={countryCode ? `/${countryCode.toLowerCase()}/search` : '/browse'} className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-300">
        ← {t('nav.browse')}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <SectionTitle>{t('profile.title')}</SectionTitle>
          <p className="mt-2 text-lg font-bold text-navy-900 dark:text-navy-50">{seller.name}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('profile.memberSince', { date: new Date(seller.createdAt).toLocaleDateString() })}
          </p>
          {seller.walletAddress && (
            <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
              {t('profile.wallet')}: {seller.walletAddress.slice(0, 6)}…{seller.walletAddress.slice(-4)}
            </p>
          )}
        </div>
        {seller.banned && <Badge tone="danger">{t('profile.suspended')}</Badge>}
        {stats.count > 0 && (
          <Badge tone="warning" className="px-3 py-1 text-sm">
            ★ {stats.average.toFixed(1)} · {t('profile.ratingCount', { count: stats.count })}
          </Badge>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('profile.listings')}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {activeListings.map((listing) => (
            <Link key={listing.id} href={`/${listing.countryCode.toLowerCase()}/l/${listing.id}`}>
              <div className="h-full rounded-xl border border-slate-200 p-4 transition-colors hover:border-teal-500 dark:border-slate-800">
                <p className="font-semibold text-navy-900 dark:text-navy-50">{listing.title}</p>
                <p className="mt-1 text-sm text-teal-700 dark:text-teal-300">
                  {listing.countryCode} · {formatMoney(listing.amountMinor, listing.currency, locale)}
                </p>
              </div>
            </Link>
          ))}
          {activeListings.length === 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('profile.noListings')}</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('profile.reviews')}</h2>
        <div className="mt-4 grid gap-3">
          {ratings.map((rating, index) => (
            <div key={rating.id} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">★ {rating.score}/5</p>
                <p className="text-xs text-slate-500">{reviewers[index]?.name ?? 'OpenCaribe user'}</p>
              </div>
              {rating.comment && <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{rating.comment}</p>}
              <p className="mt-1 text-xs text-slate-500">{new Date(rating.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {ratings.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t('profile.noReviews')}</p>}
        </div>
      </section>
    </Container>
  );
}
