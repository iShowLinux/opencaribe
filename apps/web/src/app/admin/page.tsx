import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getCurrentUser } from '@/lib/session';
import { getAllListings, listListingsByStatus } from '@/lib/listings-store';

import { RemoveListingButton } from '@/components/ModerationButtons';
import { OversightPanel } from '@/components/OversightPanel';
import { getPageViewStats } from '@/lib/stats';
import { moderateListing } from '@/app/moderation-actions';
import { LinkButton } from '@/components/LinkButton';
import { getT } from '@/lib/t';

export default async function AdminPage() {
  const t = await getT();
  const user = await getCurrentUser();
  const allowed = Boolean(user && (user.role === 'admin' || user.role === 'moderator'));
  const pending = allowed ? await listListingsByStatus('pending_review') : [];
  const stats = allowed ? await getPageViewStats() : null;
  const allListings = allowed ? (await getAllListings()).slice(0, 25) : [];

  return (
    <Container className="max-w-4xl py-12">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('admin.title')}</h1>
        {allowed && <Badge tone="success">{user?.role}</Badge>}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('admin.subtitle')}</p>

      {!allowed ? (
        <Card className="mt-6 p-10 text-center text-slate-600 dark:text-slate-400">
          <p>{t('admin.restricted')}</p>
          <LinkButton href="/login" className="mt-5">{t('nav.signIn')}</LinkButton>
        </Card>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card className="p-6">
              <SectionTitle className="text-lg">{t('admin.queue')}</SectionTitle>
              <p className="mt-2 text-3xl font-black text-teal-700 dark:text-teal-300">{pending.length}</p>
            </Card>
            <Card className="p-6">
              <SectionTitle className="text-lg">{t('admin.reports')}</SectionTitle>
              <p className="mt-2 text-3xl font-black text-teal-700 dark:text-teal-300">0</p>
            </Card>
            <Card className="p-6">
              <SectionTitle className="text-lg">{t('admin.roles')}</SectionTitle>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
            </Card>
            <Card className="p-6 sm:col-span-2">
              <SectionTitle className="text-lg">{t('admin.analytics')}</SectionTitle>
              <p className="mt-2 text-3xl font-black text-teal-700 dark:text-teal-300">
                {stats?.last7Days ?? 0} <span className="text-base font-medium text-slate-500">/ 7 days</span>
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('admin.analyticsTotal', { count: stats?.total ?? 0 })}</p>
              {stats && stats.topPaths.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {stats.topPaths.map((row) => (
                    <li key={row.path} className="flex justify-between gap-4">
                      <span className="truncate">{row.path}</span>
                      <span className="font-semibold">{row.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('admin.pendingReviews')}</h2>
            <div className="mt-4 grid gap-3">
              {pending.map((listing) => (
                <div key={listing.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <LinkButton href={`/${listing.countryCode.toLowerCase()}/l/${listing.id}`} size="sm">
                        {listing.title}
                      </LinkButton>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {listing.countryCode} · {listing.regionId} · {listing.categoryId}
                      </p>
                    </div>
                    <Badge tone="warning">{listing.status}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{listing.description}</p>
                  <form action={moderateListing} className="mt-4 flex gap-2">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button
                      type="submit"
                      name="decision"
                      value="approve"
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {t('admin.approve')}
                    </button>
                    <button
                      type="submit"
                      name="decision"
                      value="reject"
                      className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      {t('admin.reject')}
                    </button>
                  </form>
                </div>
              ))}
              {pending.length === 0 && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('admin.noPending')}</p>
              )}
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('admin.listingsTitle')}</h2>
            <div className="mt-4 grid gap-2">
              {allListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="min-w-0">
                    <LinkButton href={`/${listing.countryCode.toLowerCase()}/l/${listing.id}`} size="sm" className="truncate">
                      {listing.title}
                    </LinkButton>
                    <p className="text-xs text-slate-500">{listing.countryCode} · {listing.status}</p>
                  </div>
                  {listing.status !== 'removed' && <RemoveListingButton listingId={listing.id} />}
                </div>
              ))}
            </div>
          </Card>

          {user && <OversightPanel role={user.role === 'admin' ? 'admin' : 'moderator'} />}
        </>
      )}
    </Container>
  );
}
