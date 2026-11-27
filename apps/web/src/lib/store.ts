import { isDatabaseConfigured } from '@opencaribe/database';
import * as local from './local-store';
import * as pg from './db-store';
import { getAllListings } from './listings-store';

/**
 * Storage facade: PostgreSQL when DATABASE_URL is configured, otherwise the
 * JSON/memory demo store. Callers never branch on configuration themselves.
 */
const impl = (isDatabaseConfigured() ? pg : local) as typeof local;

export const SESSION_COOKIE = local.SESSION_COOKIE;
export type { LocalUser, LocalSession, LocalThread, LocalMessage, LocalOrder, LocalRating, LocalOffer, LocalForumThread, LocalForumReply, SellerStats } from './local-store';

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

export async function setUserRole(userId: string, role: 'user' | 'moderator' | 'admin'): Promise<void> {
  return impl.setUserRole(userId, role);
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

export async function createOffer(input: {
  listingId: string;
  buyerId: string;
  amountMinor: number;
  currency: string;
  message?: string;
}): Promise<local.LocalOffer> {
  return impl.createOffer(input);
}

export async function listOffersForListing(listingId: string): Promise<local.LocalOffer[]> {
  return impl.listOffersForListing(listingId);
}

export async function listOffersByBuyer(buyerId: string): Promise<local.LocalOffer[]> {
  return impl.listOffersByBuyer(buyerId);
}

export async function respondToOffer(offerId: string, status: 'accepted' | 'declined'): Promise<local.LocalOffer | undefined> {
  return impl.respondToOffer(offerId, status);
}

export async function cancelOffer(offerId: string, buyerId: string): Promise<local.LocalOffer | undefined> {
  return impl.cancelOffer(offerId, buyerId);
}

export async function listOffersForSeller(sellerKey: string): Promise<local.LocalOffer[]> {
  if (!isDatabaseConfigured()) {
    const listings = await getAllListings();
    const ids = new Set(listings.filter((listing) => listing.sellerId === sellerKey).map((listing) => listing.id));
    return (await local.listOffers()).filter((offer) => ids.has(offer.listingId));
  }
  return pg.listOffersForSeller(sellerKey);
}

export async function createForumThread(input: {
  authorId: string;
  category: 'events' | 'feedback' | 'support';
  title: string;
  body: string;
}): Promise<local.LocalForumThread> {
  return impl.createForumThread(input);
}

export async function listForumThreads(category?: string): Promise<local.LocalForumThread[]> {
  return impl.listForumThreads(category);
}

export async function getForumThread(threadId: string): Promise<local.LocalForumThread | undefined> {
  return impl.getForumThread(threadId);
}

export async function listForumReplies(threadId: string): Promise<local.LocalForumReply[]> {
  return impl.listForumReplies(threadId);
}

export async function createForumReply(input: { threadId: string; authorId: string; body: string }): Promise<local.LocalForumReply | undefined> {
  return impl.createForumReply(input);
}

export async function setUserBanned(userId: string, banned: boolean): Promise<void> {
  return impl.setUserBanned(userId, banned);
}

export async function listUsers(limit = 50): Promise<local.LocalUser[]> {
  return impl.listUsers(limit);
}

export async function listAllThreads(limit = 50): Promise<local.LocalThread[]> {
  return impl.listAllThreads(limit);
}

export async function listAllOffers(limit = 50): Promise<local.LocalOffer[]> {
  return impl.listAllOffers(limit);
}

export async function updateUserWhatsapp(userId: string, whatsapp: string): Promise<void> {
  return impl.updateUserWhatsapp(userId, whatsapp);
}

export async function createChatMessage(userId: string, body: string): Promise<local.LocalChatMessage | undefined> {
  return impl.createChatMessage(userId, body);
}

export async function listChatMessages(limit = 100): Promise<local.LocalChatMessage[]> {
  return impl.listChatMessages(limit);
}

export async function upsertNewsArticles(rows: Array<{ outlet: string; title: string; url: string; summary: string; publishedAt: string }>): Promise<number> {
  return impl.upsertNewsArticles(rows);
}

export async function listNewsArticles(limit = 60): Promise<local.LocalNewsArticle[]> {
  return impl.listNewsArticles(limit);
}

export async function getNewsMeta(key: string): Promise<string | undefined> {
  return impl.getNewsMeta(key);
}

export async function setNewsMeta(key: string, value: string): Promise<void> {
  return impl.setNewsMeta(key, value);
}
