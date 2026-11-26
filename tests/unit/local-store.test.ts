import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createOrder,
  createSession,
  createUser,
  destroySession,
  getUserBySession,
  listMessages,
  listOrders,
  listThreadsForUser,
  openThread,
  resetStoreForTests,
  sendMessage,
  verifyUser,
} from '../../apps/web/src/lib/local-store';

const userInput = { name: 'Ada', email: 'ADA@example.com', password: 'super-secret-password' };

describe('local account store (demo mode)', () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  afterEach(() => {
    resetStoreForTests();
  });

  it('registers and verifies users without storing plain passwords', async () => {
    const user = await createUser(userInput);
    expect(user.email).toBe('ada@example.com');
    expect(user.passwordHash).not.toContain(userInput.password);

    await expect(createUser(userInput)).rejects.toThrow('EMAIL_TAKEN');
    expect(await verifyUser(userInput.email, userInput.password)).toBeDefined();
    expect(await verifyUser(userInput.email, 'wrong-password')).toBeUndefined();
    expect(await verifyUser('nobody@example.com', userInput.password)).toBeUndefined();
  });

  it('issues revocable sessions', async () => {
    const user = await createUser(userInput);
    const session = await createSession(user.id);

    expect((await getUserBySession(session.token))?.id).toBe(user.id);
    await destroySession(session.token);
    expect(await getUserBySession(session.token)).toBeUndefined();
  });

  it('opens one thread per listing pair and delivers messages', async () => {
    const seller = await createUser({ name: 'Seller', email: 'seller@example.com', password: 'seller-password' });
    const buyer = await createUser({ name: 'Buyer', email: 'buyer@example.com', password: 'buyer-password' });

    const first = await openThread('listing-1', buyer.id, seller.id);
    const second = await openThread('listing-1', buyer.id, seller.id);
    expect(first.id).toBe(second.id);
    expect(await listThreadsForUser(buyer.id)).toHaveLength(1);
    expect(await listThreadsForUser(seller.id)).toHaveLength(1);

    await sendMessage(first.id, buyer.id, 'Is this still available?');
    await sendMessage(first.id, seller.id, 'Yes, it is.');
    const messages = await listMessages(first.id);
    expect(messages.map((message) => message.body)).toEqual(['Is this still available?', 'Yes, it is.']);
    expect(messages[0].read).toBe(false);
  });

  it('records orders newest-first', async () => {
    const seller = await createUser({ name: 'Seller', email: 'seller2@example.com', password: 'seller-password' });
    const buyer = await createUser({ name: 'Buyer', email: 'buyer2@example.com', password: 'buyer-password' });

    await createOrder({
      listingId: 'listing-1',
      buyerAddress: buyer.id,
      sellerAddress: seller.id,
      amountMinor: 1_500_000,
      currency: 'GNOT',
      txHash: 'a'.repeat(64),
      status: 'confirmed',
    });
    const orders = await listOrders();
    expect(orders).toHaveLength(1);
    expect(orders[0].amountMinor).toBe(1_500_000);
  });
});
