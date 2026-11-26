import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@opencaribe/configuration';
import { Card } from '@opencaribe/ui';
import { categoryImage } from '@/lib/images';
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
      <Card className="flex h-full flex-col items-start gap-2 overflow-hidden p-3 transition-colors hover:border-teal-500 dark:hover:border-teal-400">
        <div className="relative h-20 w-full overflow-hidden rounded-lg bg-navy-800">
          <Image
            src={categoryImage(category.slug, 360)}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            className="object-cover"
            loading="lazy"
          />
          <span aria-hidden="true" className="absolute left-2 top-2 rounded bg-navy-950/60 px-2 py-1 text-sm text-white">{category.icon}</span>
        </div>
        <span className="px-1 font-semibold text-navy-900 dark:text-navy-50">{category.names[locale]}</span>
        <span className="mt-auto px-1 text-xs text-slate-500 dark:text-slate-400">{count} {t('search.results')}</span>
      </Card>
    </Link>
  );
}
