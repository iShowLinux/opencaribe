'use client';

import { useLocale, useTranslations } from 'next-intl';
import { setLocale } from '@/app/actions';

export function LocaleSwitcher() {
  const common = useTranslations('common');
  const locale = useLocale();
  const nextLocale = locale === 'en' ? 'es' : 'en';
  return (
    <form action={setLocale} className="inline-flex">
      <input type="hidden" name="locale" value={nextLocale} />
      <button
        type="submit"
        className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label={common('language')}
      >
        {nextLocale.toUpperCase()}
      </button>
    </form>
  );
}
