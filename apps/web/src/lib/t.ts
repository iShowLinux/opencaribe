import { getLocale } from 'next-intl/server';
import { isValidLocale, translate } from '@opencaribe/localization';

export async function getT() {
  const raw = await getLocale();
  const locale = isValidLocale(raw) ? raw : 'en';
  return (key: string, params: Record<string, string | number> = {}) => translate(locale, key, params);
}
