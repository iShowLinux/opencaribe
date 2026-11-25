import Link from 'next/link';
import type { Locale } from '@opencaribe/configuration';
import { Card } from '@opencaribe/ui';
import { getT } from '@/lib/t';

export async function CategoryCard({
  category,
  countryCode,
  locale,
  count = 0,
}: {
  category: { id: string; slug: string; names: Record<Locale, string>; icon: string };
  countryCode: string;
  locale: Locale;
  count?: number;
}) {
  const t = await getT();
  return (
    <Link href={`/${countryCode.toLowerCase()}/c/${category.slug}`}>
      <Card className="flex h-full flex-col items-start gap-2 p-5 transition-colors hover:border-teal-500 dark:hover:border-teal-400">
        <span aria-hidden="true" className="text-2xl">{category.icon}</span>
        <span className="font-semibold text-navy-900 dark:text-navy-50">{category.names[locale]}</span>
        <span className="mt-auto text-xs text-slate-500 dark:text-slate-400">{count} {t('search.results')}</span>
      </Card>
    </Link>
  );
}
