'use client';

import { useEffect, useActionState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Textarea } from '@opencaribe/ui';
import { sendMessageAction, type MessageState } from '@/app/message-actions';

const initialState: MessageState = { status: 'idle' };

export function MessageComposer({ threadId }: { threadId: string }) {
  const t = useTranslations('messages');
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState(sendMessageAction, initialState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && state.status === 'idle') {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state.status]);

  return (
    <form ref={formRef} action={formAction} className="mt-5 grid gap-3">
      <input type="hidden" name="threadId" value={threadId} />
      <Textarea id="body" name="body" minLength={2} maxLength={2000} required placeholder={t('placeholder')} rows={4} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">{t('deliveryNote')}</p>
        <Button type="submit" disabled={pending}>{pending ? '…' : t('send')}</Button>
      </div>
      {state.status === 'error' && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{state.message}</p>}
    </form>
  );
}
