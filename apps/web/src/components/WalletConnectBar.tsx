'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge, Button, Card } from '@opencaribe/ui';
import { connectAdenaWallet, displayAddress, type WalletAccount } from '@/lib/wallet';

interface Props {
  account: WalletAccount | null;
  onChange: (account: WalletAccount | null) => void;
}

/**
 * Wallet identity used for no-account posting. The connection itself comes
 * from the Adena extension; OpenCaribe only records the returned address.
 */
export function WalletConnectBar({ account, onChange }: Props) {
  const t = useTranslations('post');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function connect() {
    setBusy(true);
    setError('');
    try {
      onChange(await connectAdenaWallet());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('walletError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mb-6 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sand-100 text-lg dark:bg-slate-800">🔵</span>
          <div>
            <p className="font-semibold text-navy-900 dark:text-navy-50">{t('walletTitle')}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {account ? t('walletConnectedAs', { address: displayAddress(account.address) }) : t('walletNote')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {account && <Badge tone="success">{t('walletConnected')}</Badge>}
          <Button variant={account ? 'secondary' : 'primary'} size="sm" onClick={() => (account ? onChange(null) : void connect())} disabled={busy}>
            {busy ? '…' : account ? t('walletDisconnect') : t('walletConnect')}
          </Button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </Card>
  );
}
