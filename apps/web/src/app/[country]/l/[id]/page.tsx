import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import { CURRENCIES, COUNTRIES, formatMoney, getCategoryBySlug, toCountryCode, type Locale } from '@opencaribe/configuration';
import { findLocationLabel } from '@opencaribe/geography';
import { notFound } from 'next/navigation';
import { Badge, Card, Container } from '@opencaribe/ui';
import { ContactSellerButton } from '@/components/ContactSellerButton';
import { LinkButton } from '@/components/LinkButton';
import { WalletPayButton } from '@/components/WalletPayButton';
import { getCurrentUser } from '@/lib/session';
import { getSellerStats, getUserById } from '@/lib/store';
import { RateSellerForm } from '@/components/RateSellerForm';
import { CryptoPaymentCard } from '@/components/CryptoPaymentCard';
import { ReportForm } from '@/components/ReportForm';
import { categoryImage } from '@/lib/images';
import { getListingById } from '@/lib/listings-store';
import { getT } from '@/lib/t';

export default async function ListingPage({ params }: { params: Promise<{ country: string; id: string }> }) {
  const { country: rawCode, id } = await params;
  const code = toCountryCode(rawCode);
  if (!code) notFound();
  const listing = await getListingById(id);
  if (!listing || listing.countryCode !== code) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const viewer = await getCurrentUser();
  const sellerKey = listing.sellerId.startsWith('user:') ? listing.sellerId.slice(5) : listing.sellerId;
  const category = getCategoryBySlug(listing.categoryId);
  const location = findLocationLabel(listing.cityId, locale) ?? findLocationLabel(listing.regionId, locale) ?? '';
  const price =
    listing.priceType === 'free'
      ? t('listing.free')
      : listing.priceType === 'contact'
        ? t('listing.contactForPrice')
        : formatMoney(listing.amountMinor, listing.currency, locale);

  const attributeEntries = Object.entries(listing.attributes ?? {});
  const crypto = COUNTRIES[code].cryptoPayments;
  const currencyDigits = CURRENCIES[listing.currency]?.digits ?? 2;
  const ugnotAmount = Math.round((listing.amountMinor / 10 ** currencyDigits) * 1_000_000);
  const sellerAccount = listing.sellerId.startsWith('user:') ? await getUserById(sellerKey) : undefined;
  const walletSellerAddress = listing.sellerId.startsWith('wallet:') ? listing.sellerId.slice(7) : undefined;
  const sellerWallet = listing.walletAddress ?? walletSellerAddress ?? sellerAccount?.walletAddress;
  const canPayCrypto = Boolean(sellerWallet) && crypto.walletConnect.enabled && ugnotAmount > 0 && listing.priceType !== 'free';
  const sellerName = listing.sellerId.startsWith('user:')
    ? (sellerAccount?.name ?? 'Marketplace seller')
    : `${listing.sellerId.slice(7, 13)}…${listing.sellerId.slice(-4)}`;
  const ratingStats = await getSellerStats(listing.sellerId);
  const sellerProfileHref = listing.sellerId.startsWith('user:') ? `/${code.toLowerCase()}/u/${listing.sellerId.slice(5)}` : null;

  return (
    <Container className="py-10">
      <Link href={`/${code.toLowerCase()}/search`} className="text-sm text-teal-700 hover:underline dark:text-teal-300">← {t('search.title')}</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="relative h-72 overflow-hidden rounded-xl bg-gradient-to-br from-navy-900 to-teal-800">
            <Image
              src={listing.imageUrl ?? categoryImage(listing.categoryId, 1000)}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute left-3 top-3 rounded-lg bg-navy-950/60 px-3 py-1.5 text-2xl text-white">{category?.icon ?? '📦'}</span>
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{listing.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>{new Intl.DateTimeFormat(locale === 'es' ? 'es-VE' : 'en-TT', { dateStyle: 'long' }).format(listing.createdAt)}</span>
            <span>·</span>
            <span>{listing.viewsCount} {t('listing.views')}</span>
            {listing.negotiable && <Badge tone="teal">{t('listing.negotiable')}</Badge>}
          </div>

          <Card className="mt-6 p-6">
            <h2 className="text-lg font-bold text-navy-900 dark:text-navy-50">{t('listing.details')}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{listing.description}</p>
            {attributeEntries.length > 0 && (
              <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:grid-cols-2">
                {attributeEntries.map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <dt className="font-semibold capitalize text-slate-800 dark:text-slate-200">{key.replace(/([A-Z])/g, ' $1')}</dt>
                    <dd className="text-slate-600 dark:text-slate-400">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-navy-900 dark:text-navy-50">{t('listing.report')}</h2>
            <div className="mt-3"><ReportForm listingId={listing.id} /></div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-24 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('listing.price')}</p>
            <p className="mt-1 text-3xl font-black text-teal-800 dark:text-teal-300">{price}</p>
            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
              <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{t('listing.location')}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{location || '—'}</p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('listing.seller')}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-navy-900 dark:text-navy-50">
                {sellerProfileHref ? (
                  <a href={sellerProfileHref} className="hover:text-teal-700 hover:underline dark:hover:text-teal-300">{sellerName}</a>
                ) : sellerName}
                {ratingStats.count > 0 && (
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    ★ {ratingStats.average.toFixed(1)} ({ratingStats.count})
                  </span>
                )}
              </p>
            </div>
            {viewer?.id === sellerKey && (
              <LinkButton href={`/${code.toLowerCase()}/account`} variant="secondary" className="mt-4 w-full">
                {t('dashboard.title')}
              </LinkButton>
            )}
            <ContactSellerButton countryCode={code} listingId={listing.id} loggedIn={Boolean(viewer)} isOwner={viewer?.id === sellerKey} />
            <RateSellerForm sellerKey={listing.sellerId} listingId={listing.id} loggedIn={Boolean(viewer)} isOwner={viewer?.id === sellerKey} />
            {canPayCrypto && sellerWallet && (
              <WalletPayButton
                listingId={listing.id}
                sellerAddress={sellerWallet}
                ugnotAmount={ugnotAmount}
                expectedChainId={crypto.walletConnect.chainId}
                networkLabel={crypto.walletConnect.network}
                faucetUrl={crypto.walletConnect.faucetUrl}
              />
            )}
            <p className="mt-4 rounded-lg bg-sand-100 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              ⚠️ {t('listing.safetyNote')}
            </p>
            <label className="mt-4 block text-xs text-slate-500">
              {t('listing.share')}
              <input readOnly value={`/ ${code.toLowerCase()}/l/${listing.id}`.replace(' ', '')} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900" />
            </label>
          </Card>
          <CryptoPaymentCard compact />
        </aside>
      </div>
    </Container>
  );
}
