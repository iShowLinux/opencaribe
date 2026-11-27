'use server';

import { revalidatePath } from 'next/cache';
import { getListingById } from '@/lib/listings-store';
import { getCurrentUser } from '@/lib/session';
import { getGnotBalanceMinor } from '@/lib/wallet-balance';
import { COUNTRIES, toCountryCode } from '@opencaribe/configuration';
import {
  describeSeller,
  getThreadForUser,
  listMessages,
  markThreadRead,
  openThread,
  sendMessage,
} from '@/lib/store';

export interface MessageState {
  status: 'idle' | 'error';
  message?: string;
}

/** Converts a stored sellerId into the key used inside message threads. */
function sellerKey(sellerId: string): string {
  return sellerId.startsWith('user:') ? sellerId.slice(5) : sellerId;
}

export type StartThreadFailure = 'auth' | 'missing' | 'own' | 'wallet' | 'balance';

export interface StartThreadResult {
  ok: boolean;
  threadId?: string;
  reason?: StartThreadFailure;
  haveMinor?: number;
}

/** Wallet gate: crypto-priced ads and wallet sellers require a connected wallet. */
export async function checkContactGate(
  user: { id: string; walletAddress?: string },
  listing: { currency: string; amountMinor: number; sellerId: string; walletAddress?: string; countryCode: string },
): Promise<{ blocked: false } | { blocked: true; reason: 'wallet' | 'balance'; haveMinor?: number }> {
  const cryptoPriced = listing.currency === 'GNOT';
  const walletSeller = listing.sellerId.startsWith('wallet:') || Boolean(listing.walletAddress);
  if ((cryptoPriced || walletSeller) && !user.walletAddress) return { blocked: true, reason: 'wallet' };
  if (!cryptoPriced) return { blocked: false };
  const market = COUNTRIES[toCountryCode(listing.countryCode) ?? 'TT'];
  const haveMinor = await getGnotBalanceMinor(user.walletAddress as string, market.cryptoPayments.walletConnect.rpcUrl);
  if (haveMinor === null) {
    // Balance oracle unavailable: never lock the marketplace on an RPC outage.
    return { blocked: false };
  }
  if (haveMinor < listing.amountMinor) return { blocked: true, reason: 'balance', haveMinor };
  return { blocked: false };
}

export async function startThread(listingId: string): Promise<StartThreadResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: 'auth' };
  const listing = await getListingById(listingId);
  if (!listing) return { ok: false, reason: 'missing' };
  if (sellerKey(listing.sellerId) === user.id) return { ok: false, reason: 'own' };

  const gate = await checkContactGate(user, listing);
  if (gate.blocked) return { ok: false, reason: gate.reason, haveMinor: gate.haveMinor };

  const thread = await openThread(listingId, user.id, sellerKey(listing.sellerId));
  revalidatePath('/', 'layout');
  return { ok: true, threadId: thread.id };
}

export async function sendMessageAction(_previous: MessageState, formData: FormData): Promise<MessageState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'You must be signed in to send messages.' };

  const threadId = String(formData.get('threadId') ?? '');
  const body = String(formData.get('body') ?? '');
  const thread = await getThreadForUser(threadId, user.id);
  if (!thread) return { status: 'error', message: 'This conversation is no longer available.' };
  if (body.trim().length < 2 || body.trim().length > 2000) {
    return { status: 'error', message: 'Messages must be between 2 and 2000 characters.' };
  }

  await sendMessage(threadId, user.id, body);
  await markThreadRead(threadId, user.id);
  revalidatePath('/', 'layout');
  return { status: 'idle' };
}

/** Server helper used by the inbox and conversation pages. */
export async function loadThread(threadId: string) {
  const user = await getCurrentUser();
  if (!user) return { user: undefined, thread: undefined, messages: [] as Awaited<ReturnType<typeof listMessages>>, otherLabel: '' };
  const thread = await getThreadForUser(threadId, user.id);
  if (!thread) return { user, thread: undefined, messages: [], otherLabel: '' };
  const messages = await listMessages(threadId);
  await markThreadRead(threadId, user.id);
  const otherId = thread.participantIds.find((participant) => participant !== user.id) ?? '';
  const otherLabel = await describeSeller(otherId.startsWith('g1') ? `wallet:${otherId}` : `user:${otherId}`);
  return { user, thread, messages, otherLabel };
}
