import { Badge, Card } from '@opencaribe/ui';
import { getLocale } from 'next-intl/server';
import { formatMoney, type Locale } from '@opencaribe/configuration';
import { getListingById } from '@/lib/listings-store';
import { describeSeller, listAllOffers, listAllThreads, listOrders, listUsers } from '@/lib/store';
import { getT } from '@/lib/t';
import { BanUserButton } from '@/components/ModerationButtons';
import { Conversation } from '@/components/ConversationCard';

/**
 * Staff oversight: members, every offer, every transaction and (for admins)
 * read-only access to marketplace conversations. Rendered on /admin and,
 * for privileged accounts, inside their own dashboard.
 */
export async function OversightPanel({ role }: { role: 'admin' | 'moderator' }) {
  const t = await getT();
  const locale = (await getLocale()) as Locale;

  const members = await listUsers(30);
  const offers = await listAllOffers(30);
  const orders = await listOrders();
  const threads = role === 'admin' ? await listAllThreads(12) : [];

  const titles = new Map<string, string>();
  async function titleFor(listingId: string) {
    if (!titles.has(listingId)) {
      const listing = await getListingById(listingId);
      titles.set(listingId, listing?.title ?? '(removed)');
    }
    return titles.get(listingId)!;
  }
  const offerRows = await Promise.all(
    offers.map(async (offer) => ({ ...offer, title: offer.listingId ? await titleFor(offer.listingId) : '—' })),
  );
  const orderRows = await Promise.all(orders.map(async (order) => ({ ...order, title: await titleFor(order.listingId) })));

  const labels = new Map<string, string>();
  async function labelFor(id: string) {
    if (!labels.has(id)) labels.set(id, await describeSeller(id));
    return labels.get(id)!;
  }

  return (
    <>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('admin.membersTitle')}</h2>
        <div className="mt-4 grid gap-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-navy-900 dark:text-navy-50">{member.name}</p>
                <p className="truncate text-xs text-slate-500">{member.email} · {member.role}{member.banned ? ' · banned' : ''}</p>
              </div>
              <BanUserButton userId={member.id} banned={member.banned} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('admin.offersTitle')}</h2>
        <div className="mt-4 grid gap-2">
          {offerRows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-navy-900 dark:text-navy-50">{row.title}</p>
                <p className="text-xs text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge tone={row.status === 'accepted' ? 'success' : row.status === 'declined' ? 'danger' : 'warning'}>{row.status}</Badge>
            </div>
          ))}
          {offers.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">No offers yet.</p>}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('admin.transactionsTitle')}</h2>
        <div className="mt-4 grid gap-2">
          {orderRows.map((row) => (
            <div key={row.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-navy-900 dark:text-navy-50">{row.title}</p>
                <Badge tone="success">{row.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {row.buyerAddress.slice(0, 6)}… → {row.sellerAddress.slice(0, 6)}… · {formatMoney(row.amountMinor, row.currency as never, locale)} · {row.txHash.slice(0, 10)}…
              </p>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">No transactions yet.</p>}
        </div>
      </Card>

      {role === 'admin' && (
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('admin.conversationsTitle')}</h2>
          <div className="mt-4 grid gap-3">
            {threads.map((thread) => (
              <Conversation key={thread.id} thread={thread} labelFor={labelFor} />
            ))}
            {threads.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">No conversations yet.</p>}
          </div>
        </Card>
      )}
    </>
  );
}
