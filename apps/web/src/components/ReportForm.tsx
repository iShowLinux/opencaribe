'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Label, Select, Textarea } from '@opencaribe/ui';
import { reportListing } from '@/app/actions';

interface ReportState { ok: boolean; message: string }

export function ReportForm({ listingId }: { listingId: string }) {
  const t = useTranslations('listing');
  const [state, action, pending] = useActionState<ReportState, FormData>(
    async (_previous, formData) => reportListing(formData),
    { ok: false, message: '' },
  );

  return (
    <form action={action} className="grid gap-3 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <input type="hidden" name="listingId" value={listingId} />
      <Label htmlFor="reason">{t('report')}</Label>
      <Select id="reason" name="reason" defaultValue="prohibited">
        <option value="prohibited">Prohibited item</option>
        <option value="fraud">Suspected fraud</option>
        <option value="misleading">Misleading information</option>
        <option value="spam">Spam</option>
        <option value="safety">Safety concern</option>
        <option value="other">Other</option>
      </Select>
      <Textarea id="details" name="details" placeholder="Optional details" />
      <Button type="submit" variant="secondary" disabled={pending}>{pending ? '…' : t('report')}</Button>
      {state.message && <p role="status" className={`text-sm ${state.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{state.message}</p>}
    </form>
  );
}
