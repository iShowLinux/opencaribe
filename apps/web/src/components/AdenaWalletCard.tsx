'use client';

import { useSyncExternalStore, useState } from 'react';
import { connectAdenaWallet } from '@/lib/wallet';
import { useTranslations } from 'next-intl';
import { formatMinorUnits, isExpectedNetwork, parseCoinString, shortAddress } from '@opencaribe/payments';
import { Badge, Button, Card } from '@opencaribe/ui';

interface Props {
  expectedChainId: string;
  network: 'testnet' | 'mainnet';
  assetSymbol: string;
  assetDenom: string;
  assetDecimals: number;
  faucetUrl: string;
}

interface ConnectedAccount {
  address: string;
  coins: string;
  chainId: string;
}

/** Client-only flag without an effect (safe for hydration). */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

/**
 * Read-only wallet connection for Phase 1. It asks Adena for the connected
 * account and displays address, balance and network. No transaction is built,
 * signed or broadcast, and no key material ever leaves the extension.
 */
export function AdenaWalletCard(props: Props) {
  const t = useTranslations('payment');
  const [account, setAccount] = useState<ConnectedAccount | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const mounted = useMounted();
  const detected = mounted && Boolean(window.adena);

  async function connect() {
    if (!window.adena) {
      window.open('https://adena.app', '_blank', 'noopener,noreferrer');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const connected = await connectAdenaWallet();
      setAccount({
        address: connected.address,
        coins: connected.coins ?? '',
        chainId: connected.chainId,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('wallet.error'));
    } finally {
      setBusy(false);
    }
  }

  const parsed = account ? parseCoinString(account.coins) : null;
  const wrongNetwork = account !== null && !isExpectedNetwork(account.chainId, props.expectedChainId);
  const denomMismatch = parsed !== null && parsed.denom !== props.assetDenom;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sand-100 text-xl dark:bg-slate-800">🔵</span>
          <div>
            <p className="font-semibold text-navy-900 dark:text-navy-50">{t('cryptoTitle')}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('wallet.paymentsPending')}</p>
          </div>
        </div>
        <Badge tone={account ? 'success' : 'warning'}>{account ? t('wallet.connected') : t('comingSoon')}</Badge>
      </div>

      {!detected && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          {t('wallet.notInstalled')}
        </p>
      )}
      {detected && !account && <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{t('wallet.detected')}</p>}

      {account && (
        <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{t('wallet.address')}</dt>
            <dd className="font-mono text-xs">{shortAddress(account.address)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{t('wallet.balance')}</dt>
            <dd className="font-semibold">{parsed ? formatMinorUnits(parsed.amountMinor, props.assetDecimals, props.assetSymbol) : account.coins || '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{t('wallet.network')}</dt>
            <dd>{account.chainId || '—'}</dd>
          </div>
        </dl>
      )}

      {denomMismatch && (
        <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">
          {t('wallet.balance')} · {parsed?.denom}
        </p>
      )}

      {wrongNetwork && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-900/30 dark:text-rose-200">
          {t('wallet.wrongNetwork', { actual: account?.chainId ?? '', expected: props.expectedChainId })}
        </p>
      )}

      {props.network === 'testnet' && (
        <p className="mt-4 rounded-lg bg-sand-100 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {t('wallet.testnetNote', { chainId: props.expectedChainId })}{' '}
          <a href={props.faucetUrl} target="_blank" rel="noreferrer" className="font-medium underline">
            {t('wallet.faucet')}
          </a>
        </p>
      )}

      <Button
        variant={account ? 'secondary' : 'primary'}
        disabled={busy}
        onClick={() => {
          if (account) setAccount(null);
          else void connect();
        }}
        className="mt-5 w-full"
      >
        {busy ? '…' : account ? t('wallet.disconnect') : detected ? t('wallet.connect') : t('wallet.install')}
      </Button>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </Card>
  );
}
