'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@opencaribe/ui';
import { LinkButton } from '@/components/LinkButton';
import { startThread } from '@/app/message-actions';

interface Props {
  countryCode: string;
  listingId: string;
  loggedIn: boolean;
  isOwner: boolean;
}

export function ContactSellerButton({ countryCode, listingId, loggedIn, isOwner }: Props) {
  const t = useTranslations('messages');
  const router = useRouter();
  const [pending, start] = useTransition();
  const [blocked, setBlocked] = useState<string>('');

  if (!loggedIn) {
    return <LinkButton href="/login" className="mt-6 w-full">{t('signInToMessage')}</LinkButton>;
  }

  if (isOwner) {
    return <Button className="mt-6 w-full" disabled>{t('yourListing')}</Button>;
  }

  return (
    <Button
      className="mt-6 w-full"
      disabled={pending}
      onClick={() =>
        start(async () => {
          setBlocked('');
          const result = await startThread(listingId);
          if (result.ok && result.threadId) {
            router.push(`/${countryCode.toLowerCase()}/messages/${result.threadId}`);
            return;
          }
          if (result.reason === 'wallet') setBlocked('wallet');
          else if (result.reason === 'balance') setBlocked('balance');
        })
      }
    >
      {pending ? '…' : t('contactSeller')}
    </Button>
  );

  if (blocked === 'wallet') {
    return (
      <div className="mt-6">
        <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">{t('walletRequired')}</p>
        <LinkButton href="/account#wallet" variant="secondary" className="mt-3 w-full">{t('connectWallet')}</LinkButton>
      </div>
    );
  }

  if (blocked === 'balance') {
    return (
      <div className="mt-6">
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{t('insufficientBalance')}</p>
        <LinkButton href="/account#wallet" variant="secondary" className="mt-3 w-full">{t('switchWallet')}</LinkButton>
      </div>
    );
  }
}
