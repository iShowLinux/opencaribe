"use server";

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { getListingById } from '@/lib/listings-store';
import { checkContactGate } from '@/app/message-actions';
import { createOffer, listOffersForSeller, respondToOffer, cancelOffer } from '@/lib/store';

export interface OfferFormState {
  status: 'idle' | 'error' | 'success';
  message?: string;
}

export async function submitOfferAction(_previous: OfferFormState, formData: FormData): Promise<OfferFormState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sign in to make an offer.' };

  const listingId = String(formData.get('listingId') ?? '');
  const listing = await getListingById(listingId);
  if (!listing || listing.status !== 'active') return { status: 'error', message: 'This listing is no longer available.' };
  if (listing.sellerId === `user:${user.id}` || (user.walletAddress && listing.sellerId === `wallet:${user.walletAddress}`)) {
    return { status: 'error', message: 'You cannot offer on your own listing.' };
  }

  const rawAmount = String(formData.get('amount') ?? '').trim();
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount) || amount <= 0) return { status: 'error', message: 'Enter a valid offer amount.' };
  const digits = listing.currency === 'GNOT' ? 6 : 2;
  const fractional = rawAmount.includes('.') ? (rawAmount.split('.')[1]?.length ?? 0) : 0;
  if (fractional > digits) return { status: 'error', message: 'Too many decimal places.' };
  const amountMinor = Math.round(amount * 10 ** digits);

  const gate = await checkContactGate(user, listing);
  if (gate.blocked && gate.reason === 'wallet') return { status: 'error', message: 'Connect a gno.land wallet before making an offer.' };
  if (gate.blocked && gate.reason === 'balance') return { status: 'error', message: 'Your wallet balance is below this offer amount.' };

  await createOffer({
    listingId,
    buyerId: user.id,
    amountMinor,
    currency: listing.currency,
    message: String(formData.get('message') ?? '').trim() || undefined,
  });
  revalidatePath('/', 'layout');
  return { status: 'success', message: 'Offer sent. The seller can accept or decline it from their dashboard.' };
}

/** Seller accepts or declines an offer that targets one of their listings. */
export async function respondOfferAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const offerId = String(formData.get('offerId') ?? '');
  const decision = String(formData.get('decision') ?? '');
  if (!offerId || (decision !== 'accept' && decision !== 'decline')) return;

  const received = await listOffersForSeller(`user:${user.id}`);
  if (!received.some((offer) => offer.id === offerId)) return;
  await respondToOffer(offerId, decision === 'accept' ? 'accepted' : 'declined');
  revalidatePath('/account', 'page');
  revalidatePath('/', 'layout');
}

export async function cancelOfferAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const offerId = String(formData.get('offerId') ?? '');
  if (!offerId) return;
  await cancelOffer(offerId, user.id);
  revalidatePath('/account', 'page');
  revalidatePath('/', 'layout');
}
