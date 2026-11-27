'use client';

import { useSyncExternalStore, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatMinorUnits, isExpectedNetwork } from '@opencaribe/payments';
import { Button, Card } from '@opencaribe/ui';
import { recordPayment } from '@/app/payment-actions';
import { connectAdenaWallet, displayAddress } from '@/lib/wallet';

interface Props {
  listingId: string;
  sellerAddress: string;
  /** Amount already converted to ugnot (GNOT has 6 decimals). */
  ugnotAmount: number;
  expectedChainId: string;
  networkLabel: string;
  faucetUrl: string;
}

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

/**
 * Testnet crypto checkout: connects Adena, asks the buyer to sign a real
 * `/bank.MsgSend` to the seller, then records the transaction server-side.
 */
export function WalletPayButton({ listingId, sellerAddress, ugnotAmount, expectedChainId, networkLabel, faucetUrl }: Props) {
  const t = useTranslations('payment');
  const mounted = useMounted();
  const detected = mounted && Boolean(window.adena);

  const [account, setAccount] = useState<{ address: string; chainId: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<{ orderId: string; txHash: string } | null>(null);

  async function connect() {
    if (!window.adena) return;
    setBusy(true);
    setError('');
    try {
      const connected = await connectAdenaWallet();
      setAccount({ address: connected.address, chainId: connected.chainId });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('payError'));
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    if (!window.adena || !account) return;
    setBusy(true);
    setError('');
    try {
      const result = await window.adena.DoContract({
        messages: [
          {
            type: '/bank.MsgSend',
            value: {
              from_address: account.address,
              to_address: sellerAddress,
              amount: `${Math.round(ugnotAmount)}ugnot`,
            },
          },
        ],
        gasFee: 1,
        gasWanted: 3000000,
      });
      if (result.status !== 'success') throw new Error(result.message || t('payError'));
      const txHash =
        typeof result.data === 'object' && result.data !== null && 'txhash' in result.data
          ? String((result.data as { txhash: unknown }).txhash)
          : '';
      const recorded = await recordPayment({
        listingId,
        buyerAddress: account.address,
        sellerAddress,
        amountMinor: Math.round(ugnotAmount),
        currency: 'GNOT',
        txHash,
      });
      if (!recorded.ok) throw new Error(t('payError'));
      setReceipt({ orderId: recorded.orderId, txHash });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('payError'));
    } finally {
      setBusy(false);
    }
  }

  const wrongNetwork = account !== null && !isExpectedNetwork(account.chainId, expectedChainId);

  return (
    <Card className="mt-5 p-5">
      <p className="font-semibold text-navy-900 dark:text-navy-50">{t('payTitle')}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {t('paySummary', { amount: formatMinorUnits(BigInt(Math.round(ugnotAmount)), 6, 'GNOT'), seller: displayAddress(sellerAddress) })}
      </p>

      {!detected && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          {t('wallet.notInstalled')}
        </p>
      )}

      {wrongNetwork && (
        <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-900/30 dark:text-rose-200">
          {t('wallet.wrongNetwork', { actual: account?.chainId ?? '', expected: expectedChainId })}
        </p>
      )}

      {receipt ? (
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          <p className="font-semibold">{t('paySuccess')}</p>
          <p className="mt-1 break-all font-mono text-xs">TX {receipt.txHash}</p>
          <p className="mt-1 text-xs">{t('orderId')} {receipt.orderId}</p>
          {receipt.txHash && (
            <a
              href={`https://testnets.gno.land/tx/${receipt.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-semibold underline"
            >
              {t('viewTx')} ↗
            </a>
          )}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {!account ? (
            <Button onClick={() => void connect()} disabled={busy || !detected} className="sm:flex-1">
              {busy ? '…' : t('payConnect')}
            </Button>
          ) : (
            <>
              <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {displayAddress(account.address)}
              </span>
              <Button onClick={() => void pay()} disabled={busy || wrongNetwork} className="sm:flex-1">
                {busy ? '…' : t('paySend')}
              </Button>
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {t('payTestnetNote', { network: networkLabel })}{' '}
        <a href={faucetUrl} target="_blank" rel="noreferrer" className="font-medium underline">
          {t('wallet.faucet')}
        </a>
      </p>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </Card>
  );
}
