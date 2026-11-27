import { beforeEach, describe, expect, it } from 'vitest';
import {
  cancelOffer,
  createOffer,
  listOffersByBuyer,
  listOffersForListing,
  resetStoreForTests,
  respondToOffer,
} from '../../apps/web/src/lib/local-store';

describe('offers (demo store)', () => {
  beforeEach(() => resetStoreForTests());

  it('creates, lists, accepts and cancels offers', async () => {
    const created = await createOffer({
      listingId: 'listing-1',
      buyerId: 'buyer-1',
      amountMinor: 70_00,
      currency: 'TTD',
      message: 'Would you take this?',
    });
    expect(created.status).toBe('pending');

    expect(await listOffersForListing('listing-1')).toHaveLength(1);
    expect(await listOffersByBuyer('buyer-1')).toHaveLength(1);

    const accepted = await respondToOffer(created.id, 'accepted');
    expect(accepted?.status).toBe('accepted');
    // responding again is a no-op
    expect(await respondToOffer(created.id, 'declined')).toBeUndefined();

    const second = await createOffer({ listingId: 'listing-1', buyerId: 'buyer-1', amountMinor: 10, currency: 'TTD' });
    expect((await cancelOffer(second.id, 'buyer-2'))).toBeUndefined();
    expect((await cancelOffer(second.id, 'buyer-1'))?.status).toBe('cancelled');
  });
});
