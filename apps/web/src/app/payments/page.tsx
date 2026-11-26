import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { formatMinorUnits } from '@opencaribe/payments';
import { CryptoPaymentCard } from '@/components/CryptoPaymentCard';
import { listOrders } from '@/lib/local-store';
import { getListingById } from '@/lib/listings-store';
import { getT } from '@/lib/t';

export default async function PaymentsPage() {
  const t = await getT();
  const orders = await listOrders();
  const orderRows = await Promise.all(
    orders.map(async (order) => ({ order, listing: await getListingById(order.listingId) })),
  );

  return (
    <Container className="max-w-3xl py-12">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('payment.pageTitle')}</h1>
        <Badge tone="warning">{t('payment.comingSoon')}</Badge>
      </div>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{t('payment.pageIntro')}</p>

      <div className="mt-8">
        <CryptoPaymentCard />
      </div>

      <Card className="mt-6 p-6">
        <SectionTitle className="text-xl">{t('payment.stepsTitle')}</SectionTitle>
        <ol className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {(['step1', 'step2', 'step3'] as const).map((key, index) => (
            <li key={key} className="flex gap-3">
              <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{index + 1}</span>
              <span>{t(`payment.${key}`)}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="mt-6 border-coral-200 p-6">
        <SectionTitle className="text-xl">{t('payment.safeTitle')}</SectionTitle>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t('payment.safeNote')}</p>
      </Card>

      <Card className="mt-6 p-6">
        <SectionTitle className="text-xl">{t('payment.ordersTitle')}</SectionTitle>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{t('payment.ordersEmpty')}</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {orderRows.map(({ order, listing }) => {
              return (
                <li key={order.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-navy-900 dark:text-navy-50">{listing?.title ?? order.listingId}</p>
                    <p className="font-bold text-teal-800 dark:text-teal-300">
                      {formatMinorUnits(BigInt(order.amountMinor), 6, 'GNOT')}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {t('payment.ordersSeller')} {order.sellerAddress.slice(0, 6)}…{order.sellerAddress.slice(-4)} ·{' '}
                    {t('payment.ordersBuyer')} {order.buyerAddress.slice(0, 6)}…{order.buyerAddress.slice(-4)}
                  </p>
                  <a
                    href={`https://testnets.gno.land/tx/${order.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block break-all font-mono text-xs text-teal-700 underline dark:text-teal-300"
                  >
                    {t('payment.ordersTx')} {order.txHash}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        {t('payment.walletName')} · {t('payment.sellerNote')}
      </p>
    </Container>
  );
}
