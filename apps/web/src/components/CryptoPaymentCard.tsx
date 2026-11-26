import Link from 'next/link';
import { Badge, Button, Card } from '@opencaribe/ui';
import { getT } from '@/lib/t';

/**
 * Placeholder for an upcoming Adena wallet payment method. It deliberately
 * performs no wallet detection and no network calls: the feature is coming
 * soon and must never imply that a payment can currently be made.
 */
export async function CryptoPaymentCard({ compact = false }: { compact?: boolean }) {
  const t = await getT();

  return (
    <Card className={compact ? 'p-4' : 'p-6'}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sand-100 text-xl dark:bg-slate-800">🔵</span>
          <div>
            <p className="font-semibold text-navy-900 dark:text-navy-50">{t('payment.cryptoTitle')}</p>
            {!compact && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('payment.cryptoDescription')}</p>}
          </div>
        </div>
        <Badge tone="warning">{t('payment.comingSoon')}</Badge>
      </div>

      {!compact && (
        <p className="mt-4 rounded-lg bg-sand-100 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {t('payment.walletNote')}
        </p>
      )}

      <Button variant="secondary" disabled className="mt-4 w-full">
        {t('payment.connectWallet')}
      </Button>
      <Link href="/payments" className="mt-3 block text-center text-xs font-medium text-teal-700 hover:underline dark:text-teal-300">
        {t('payment.learnMore')}
      </Link>
    </Card>
  );
}
