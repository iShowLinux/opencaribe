'use client';

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
          const result = await startThread(listingId);
          if (result.ok) router.push(`/${countryCode.toLowerCase()}/messages/${result.threadId}`);
        })
      }
    >
      {pending ? '…' : t('contactSeller')}
    </Button>
  );
}
