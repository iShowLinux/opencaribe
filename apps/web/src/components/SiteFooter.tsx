import Link from 'next/link';
import { COUNTRIES, COUNTRY_CODES } from '@opencaribe/configuration';
import { getT } from '@/lib/t';

const INFO_LINKS = [
  { slug: 'about', key: 'legal.about' },
  { slug: 'safety', key: 'legal.safety' },
  { slug: 'guidelines', key: 'legal.guidelines' },
  { slug: 'privacy', key: 'legal.privacy' },
  { slug: 'terms', key: 'legal.terms' },
  { slug: 'opensource', key: 'legal.opensource' },
];

export async function SiteFooter() {
  const t = await getT();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-navy-900/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-bold text-navy-900 dark:text-navy-50">OpenCaribe</p>
          <p className="mt-2 max-w-xs text-sm text-slate-600 dark:text-slate-400">{t('footer.tagline')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{t('footer.project')}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {COUNTRY_CODES.map((code) => (
              <li key={code}><Link href={`/${code.toLowerCase()}`} className="hover:text-teal-700">{COUNTRIES[code].displayName}</Link></li>
            ))}
            <li><Link href="/info/opensource" className="hover:text-teal-700">GitHub</Link></li>
            <li><Link href="/news" className="hover:text-teal-700">News</Link></li>
            <li><Link href="/payments" className="hover:text-teal-700">Payments (coming soon)</Link></li>
            <li><Link href="/shipping" className="hover:text-teal-700">Shipping matrix</Link></li>
            <li><Link href="/community" className="hover:text-teal-700">Community</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{t('footer.legal')}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {INFO_LINKS.map((item) => (
              <li key={item.slug}><Link href={`/info/${item.slug}`} className="hover:text-teal-700">{t(item.key)}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {t('footer.rights')}
      </div>
    </footer>
  );
}
