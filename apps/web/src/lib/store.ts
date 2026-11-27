import { isDatabaseConfigured } from '@opencaribe/database';
import * as local from './local-store';
import * as pg from './db-store';

/**
 * Storage facade: PostgreSQL when DATABASE_URL is configured, otherwise the
 * JSON/memory demo store. Callers never branch on configuration themselves.
 */
const impl = (isDatabaseConfigured() ? pg : local) as typeof local;

export const SESSION_COOKIE = local.SESSION_COOKIE;
export type { LocalUser, LocalSession, LocalThread, LocalMessage, LocalOrder, LocalRating, SellerStats } from './local-store';

export async function findUserByEmail(email: string): Promise<local.LocalUser | undefined> {
  return impl.findUserByEmail(email);
}

export async function createUser(input: { name: string; email: string; password: string }): Promise<local.LocalUser> {
  return impl.createUser(input);
}

export async function verifyUser(email: string, password: string): Promise<local.LocalUser | undefined> {
  return impl.verifyUser(email, password);
}

export async function createSession(
  userId: string,
): Promise<{ token: string; userId: string; expiresAt: string }> {
  return impl.createSession(userId);
}

export async function getUserBySession(token: string | undefined): Promise<local.LocalUser | undefined> {
  return impl.getUserBySession(token);
}

export async function getUserById(userId: string): Promise<local.LocalUser | undefined> {
  return impl.getUserById(userId);
}

export async function describeSeller(sellerId: string): Promise<string> {
  return impl.describeSeller(sellerId);
}

export async function destroySession(token: string | undefined): Promise<void> {
  return impl.destroySession(token);
}

export async function attachWallet(userId: string, walletAddress: string): Promise<void> {
  return impl.attachWallet(userId, walletAddress);
}

export async function openThread(listingId: string, buyerId: string, sellerId: string): Promise<local.LocalThread> {
  return impl.openThread(listingId, buyerId, sellerId);
}

export async function listThreadsForUser(userId: string): Promise<local.LocalThread[]> {
  return impl.listThreadsForUser(userId);
}

export async function getThreadForUser(threadId: string, userId: string): Promise<local.LocalThread | undefined> {
  return impl.getThreadForUser(threadId, userId);
}

export async function listMessages(threadId: string): Promise<local.LocalMessage[]> {
  return impl.listMessages(threadId);
}

export async function sendMessage(
  threadId: string,
  fromId: string,
  body: string,
): Promise<local.LocalMessage | undefined> {
  return impl.sendMessage(threadId, fromId, body);
}

export async function markThreadRead(threadId: string, readerId: string): Promise<void> {
  return impl.markThreadRead(threadId, readerId);
}

export async function createOrder(input: {
  listingId: string;
  buyerAddress: string;
  sellerAddress: string;
  amountMinor: number;
  currency: string;
  txHash: string;
  status: 'confirmed' | 'pending';
}): Promise<local.LocalOrder> {
  return impl.createOrder(input);
}

export async function listOrders(): Promise<local.LocalOrder[]> {
  return impl.listOrders();
}

export async function rateSeller(input: {
  sellerId: string;
  reviewerId: string;
  listingId?: string;
  score: number;
  comment?: string;
}): Promise<local.LocalRating | undefined> {
  return impl.rateSeller(input);
}

export async function listRatingsForSeller(sellerId: string): Promise<local.LocalRating[]> {
  return impl.listRatingsForSeller(sellerId);
}

export async function getSellerStats(sellerId: string): Promise<local.SellerStats> {
  return impl.getSellerStats(sellerId);
}
