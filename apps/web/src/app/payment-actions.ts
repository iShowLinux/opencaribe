'use server';

import { revalidatePath } from 'next/cache';
import { isGnoAddress } from '@/lib/wallet';
import { getListingById } from '@/lib/listings-store';
import { createOrder } from '@/lib/store';

export type PaymentRecordResult =
  | { ok: true; orderId: string }
  | { ok: false; error: 'invalid-address' | 'invalid-tx' | 'listing-missing' | 'seller-mismatch' };

/** Records a testnet wallet payment after the buyer broadcasts it from Adena. */
export async function recordPayment(input: {
  listingId: string;
  buyerAddress: string;
  sellerAddress: string;
  amountMinor: number;
  currency: string;
  txHash: string;
}): Promise<PaymentRecordResult> {
  if (!isGnoAddress(input.buyerAddress) || !isGnoAddress(input.sellerAddress)) {
    return { ok: false, error: 'invalid-address' };
  }
  if (!/^[0-9a-f]{64}$/i.test(input.txHash)) {
    return { ok: false, error: 'invalid-tx' };
  }
  if (!Number.isFinite(input.amountMinor) || input.amountMinor <= 0) {
    return { ok: false, error: 'invalid-tx' };
  }

  const listing = await getListingById(input.listingId);
  if (!listing) return { ok: false, error: 'listing-missing' };
  const expectedSeller =
    listing.walletAddress ?? (listing.sellerId.startsWith('wallet:') ? listing.sellerId.slice(7) : '');
  if (!expectedSeller || input.sellerAddress !== expectedSeller) {
    return { ok: false, error: 'seller-mismatch' };
  }

  const order = await createOrder({
    listingId: listing.id,
    buyerAddress: input.buyerAddress,
    sellerAddress: input.sellerAddress,
    amountMinor: Math.round(input.amountMinor),
    currency: input.currency,
    txHash: input.txHash.toLowerCase(),
    status: 'confirmed',
  });
  revalidatePath('/', 'layout');
  return { ok: true, orderId: order.id };
}
