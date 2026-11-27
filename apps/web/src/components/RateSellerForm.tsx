'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, Label, Select, Textarea } from '@opencaribe/ui';
import { rateSellerAction, type RatingState } from '@/app/rating-actions';
import { LinkButton } from '@/components/LinkButton';

const initialState: RatingState = { status: 'idle' };

interface Props {
  sellerKey: string;
  listingId: string;
  loggedIn: boolean;
  isOwner: boolean;
}

export function RateSellerForm({ sellerKey, listingId, loggedIn, isOwner }: Props) {
  const t = useTranslations('rating');
  const [state, formAction, pending] = useActionState(rateSellerAction, initialState);

  if (!loggedIn) return <LinkButton href="/login" variant="secondary" className="mt-4 w-full">{t('loginRequired')}</LinkButton>;
  if (isOwner) return null;

  if (state.status === 'success') {
    return (
      <Card className="mt-4 p-4 text-sm text-emerald-700 dark:text-emerald-300">
        <p role="status">{state.message}</p>
      </Card>
    );
  }

  return (
    <Card className="mt-4 p-4">
      <p className="font-semibold text-navy-900 dark:text-navy-50">{t('title')}</p>
      <form action={formAction} className="mt-3 grid gap-3">
        <input type="hidden" name="sellerKey" value={sellerKey} />
        <input type="hidden" name="listingId" value={listingId} />
        <div>
          <Label htmlFor="score">{t('score')}</Label>
          <Select id="score" name="score" defaultValue="5">
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★ (4)</option>
            <option value="3">★★★ (3)</option>
            <option value="2">★★ (2)</option>
            <option value="1">★ (1)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="comment">{t('comment')}</Label>
          <Textarea id="comment" name="comment" rows={3} maxLength={1000} />
        </div>
        <Button type="submit" disabled={pending}>{pending ? '…' : t('submit')}</Button>
        {state.status === 'error' && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{state.message}</p>}
      </form>
    </Card>
  );
}
