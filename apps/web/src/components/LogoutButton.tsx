'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@opencaribe/ui';
import { logoutAction } from '@/app/auth-actions';

export function LogoutButton() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await logoutAction();
          router.push('/');
          router.refresh();
        })
      }
    >
      {pending ? '…' : t('signOut')}
    </Button>
  );
}
