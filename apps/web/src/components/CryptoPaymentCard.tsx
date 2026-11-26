import { COUNTRIES } from '@opencaribe/configuration';
import { Badge, Button, Card } from '@opencaribe/ui';
import { AdenaWalletCard } from './AdenaWalletCard';
import { getT } from '@/lib/t';

/**
 * Payment options card. Phase 1 renders a real, read-only Adena connection
 * (testnet) so users can see their address, balance and network. When wallet
 * connect is disabled it falls back to a clearly labelled placeholder.
 */
export async function CryptoPaymentCard({ compact = false }: { compact?: boolean }) {
  const t = await getT();
  const crypto = COUNTRIES.TT.cryptoPayments;

  if (crypto.walletConnect.enabled) {
    return (
      <AdenaWalletCard
        expectedChainId={crypto.walletConnect.chainId}
        network={crypto.walletConnect.network}
        assetSymbol={crypto.asset.symbol}
        assetDenom={crypto.asset.denom}
        assetDecimals={crypto.asset.decimals}
        faucetUrl={crypto.walletConnect.faucetUrl}
      />
    );
  }

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
        {t('payment.wallet.connect')}
      </Button>
    </Card>
  );
}
