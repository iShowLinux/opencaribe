import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getCurrentUser } from '@/lib/session';
import { listListingsByStatus } from '@/lib/listings-store';
import { moderateListing } from '@/app/moderation-actions';
import { LinkButton } from '@/components/LinkButton';
import { getT } from '@/lib/t';

export default async function AdminPage() {
  const t = await getT();
  const user = await getCurrentUser();
  const allowed = Boolean(user && (user.role === 'admin' || user.role === 'moderator'));
  const pending = allowed ? await listListingsByStatus('pending_review') : [];

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
        </>
      )}
    </Container>
  );
}
