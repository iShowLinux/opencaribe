'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { isValidLocale, translate } from '@opencaribe/localization';
import { getCurrentUser } from '@/lib/session';
import { getUserById, rateSeller } from '@/lib/store';

export interface RatingState {
  status: 'idle' | 'error' | 'success';
  message?: string;
}

async function locale(): Promise<'en' | 'es'> {
  const store = await cookies();
  const raw = store.get('NEXT_LOCALE')?.value ?? 'en';
  return isValidLocale(raw) ? raw : 'en';
}

function reply(lang: 'en' | 'es', key: 'thanks' | 'error' | 'selfError' | 'loginRequired' | 'outOfRange'): RatingState {
  return { status: key === 'thanks' ? 'success' : 'error', message: translate(lang, `rating.${key}`) };
}

export async function rateSellerAction(_previous: RatingState, formData: FormData): Promise<RatingState> {
  const lang = await locale();
  const user = await getCurrentUser();
  if (!user) return reply(lang, 'loginRequired');

  const sellerKey = String(formData.get('sellerKey') ?? '').trim();
  const listingId = String(formData.get('listingId') ?? '').trim() || undefined;
  const score = Number(formData.get('score'));
  const comment = String(formData.get('comment') ?? '');

  if (!sellerKey || sellerKey === user.id || sellerKey === `user:${user.id}`) {
    return reply(lang, 'selfError');
  }
  if (sellerKey.startsWith('user:') && !(await getUserById(sellerKey.slice(5)))) {
    return reply(lang, 'error');
  }
  if (!Number.isFinite(score) || score < 1 || score > 5) {
    return reply(lang, 'outOfRange');
  }

  const saved = await rateSeller({ sellerId: sellerKey, reviewerId: user.id, listingId, score, comment });
  if (!saved) return reply(lang, 'error');
  revalidatePath('/', 'layout');
  return reply(lang, 'thanks');
}
