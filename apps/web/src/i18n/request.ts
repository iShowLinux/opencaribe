import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { isValidLocale, loadMessages } from '@opencaribe/localization';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let requested = await requestLocale;
  if (!requested) {
    try {
      requested = (await cookies()).get('NEXT_LOCALE')?.value;
    } catch {
      // Static generation has no request cookies; fall back to the default locale.
    }
  }
  const locale = requested && isValidLocale(requested) ? requested : routing.defaultLocale;
  return { locale, messages: loadMessages(locale) };
});
