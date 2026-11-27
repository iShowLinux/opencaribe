'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { COUNTRIES, COUNTRY_CODES, isCountryCode } from '@opencaribe/configuration';
import { Container } from '@opencaribe/ui';
import { LinkButton } from './LinkButton';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  userName?: string | null;
  userRole?: string | null;
}

export function SiteHeader({ userName, userRole }: Props) {
  const nav = useTranslations('nav');
  const common = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/').filter(Boolean);
  const country = segments[0] && isCountryCode(segments[0]) ? segments[0] : '';
  const base = country ? `/${country}` : '';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-sand-50/95 backdrop-blur dark:border-slate-800 dark:bg-navy-950/95">
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy-900 dark:text-navy-50">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-lg bg-teal-700 text-base text-white dark:bg-teal-500 dark:text-navy-950">OC</span>
          <span className="text-lg tracking-tight">OpenCaribe</span>
        </Link>

        <label className="sr-only" htmlFor="country-select">Country</label>
        <select
          id="country-select"
          value={country}
          onChange={(event) => router.push(`/${event.target.value}`)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm font-medium text-navy-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{common('all')}</option>
          {COUNTRY_CODES.map((code) => (
            <option key={code} value={code}>{COUNTRIES[code].displayName}</option>
          ))}
        </select>

        <nav className="order-3 w-full sm:order-none sm:ml-auto sm:w-auto" aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-1 text-sm font-medium">
            <li><Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800" href="/news">{nav('news')}</Link></li>
            <li><Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800" href={`${base}/search`}>{nav('browse')}</Link></li>
            <li><Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800" href={`${base}/post`}>{nav('post')}</Link></li>
            {(userRole === 'admin' || userRole === 'moderator') && (
              <li><Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800" href="/admin">{nav('admin')}</Link></li>
            )}
            <li className="hidden md:block"><Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800" href={`${base}/favorites`}>{nav('favorites')}</Link></li>
            <li className="hidden md:block"><Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800" href={`${base}/messages`}>{nav('messages')}</Link></li>
            {userName ? (
              <li><LinkButton href={`${base}/account`} size="sm" className="px-3 py-2">{nav('account')}</LinkButton></li>
            ) : (
              <>
                <li><LinkButton href="/login" variant="secondary" size="sm" className="px-3 py-2">{nav('signIn')}</LinkButton></li>
                <li><LinkButton href="/register" size="sm" className="px-3 py-2">{nav('signUp')}</LinkButton></li>
              </>
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <LocaleSwitcher />
          <ThemeToggle labels={{ light: common('light'), dark: common('dark'), theme: common('theme') }} />
        </div>
      </Container>
    </header>
  );
}
