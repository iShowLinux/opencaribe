'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getCountry, type CurrencyCode } from '@opencaribe/configuration';
import type { ItemCondition, PriceType } from '@opencaribe/validation';
import { isValidLocale, translate } from '@opencaribe/localization';
import { createListingSchema, reportListingSchema } from '@opencaribe/validation';
import { createDraft } from '@/lib/listings-store';

export type SubmitState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  errors?: Record<string, string[]>;
  listingId?: string;
};

async function currentLocale() {
  const store = await cookies();
  const raw = store.get('NEXT_LOCALE')?.value ?? 'en';
  return isValidLocale(raw) ? raw : 'en';
}

export async function setLocale(formData: FormData): Promise<void> {
  const requested = String(formData.get('locale') ?? '');
  if (!isValidLocale(requested)) return;
  const store = await cookies();
  store.set('NEXT_LOCALE', requested, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
  });
  revalidatePath('/', 'layout');
}

export async function submitListing(_previous: SubmitState, formData: FormData): Promise<SubmitState> {
  const locale = await currentLocale();
  const country = getCountry(String(formData.get('countryCode') ?? ''));
  if (!country) {
    return { status: 'error', message: locale === 'es' ? 'País desconocido.' : 'Unknown country.' };
  }

  const raw = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    countryCode: country.code,
    regionId: String(formData.get('regionId') ?? ''),
    cityId: String(formData.get('cityId') ?? ''),
    categoryId: String(formData.get('categoryId') ?? ''),
    subcategoryId: String(formData.get('subcategoryId') ?? ''),
    price: String(formData.get('price') ?? '0'),
    currency: String(formData.get('currency') ?? country.defaultCurrency),
    priceType: String(formData.get('priceType') ?? 'fixed'),
    negotiable: formData.get('negotiable') === 'true',
    condition: String(formData.get('condition') ?? 'good'),
    attributes: {},
    contactPreference: String(formData.get('contactPreference') ?? 'in_app_messages'),
    imageKeys: [],
  };

  const parsed = createListingSchema(country).safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      (errors[key] ??= []).push(issue.message);
    }
    return { status: 'error', message: 'Please correct the highlighted fields.', errors };
  }

  const draft = createDraft({
    ...parsed.data,
    currency: parsed.data.currency as CurrencyCode,
    priceType: parsed.data.priceType as PriceType,
    condition: parsed.data.condition as ItemCondition,
  });
  return { status: 'success', message: translate(locale, 'post.success'), listingId: draft.id };
}

export async function reportListing(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const locale = await currentLocale();
  const parsed = reportListingSchema.safeParse({
    listingId: String(formData.get('listingId') ?? ''),
    reason: String(formData.get('reason') ?? ''),
    details: String(formData.get('details') ?? '') || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: 'Please complete the report form.' };
  }
  // Phase 0: validated and accepted; persistence to the reports table lands with moderation.
  const received = locale === 'es' ? 'Gracias. Tu reporte fue recibido.' : 'Thank you. Your report has been received.';
  return { ok: true, message: received };
}
