import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { isAdminEmail } from './admin';
import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Demo-grade account, session, messaging and payment-order storage.
 *
 * Used when PostgreSQL is not configured so registration, posting and
 * messaging work end-to-end during development and public demos. All data is
 * held in module memory and mirrored to a JSON file when LOCAL_DATA_DIR (or
 * ./.opencaribe) is writable; production deployments should switch to the
 * PostgreSQL-backed implementation of these same flows.
 */

export const SESSION_COOKIE = 'oc_session';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  walletAddress?: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
}

export interface LocalSession {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface LocalThread {
  id: string;
  listingId: string;
  participantIds: string[];
  createdAt: string;
}

export interface LocalMessage {
  id: string;
  threadId: string;
  fromId: string;
  toId: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface LocalOrder {
  id: string;
  listingId: string;
  buyerAddress: string;
  sellerAddress: string;
  amountMinor: number;
  currency: string;
  txHash: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface LocalRating {
  id: string;
  sellerId: string;
  reviewerId: string;
  listingId?: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface SellerStats {
  count: number;
  average: number;
}

interface StoreShape {
  users: LocalUser[];
  sessions: LocalSession[];
  threads: LocalThread[];
  messages: LocalMessage[];
  orders: LocalOrder[];
  ratings: LocalRating[];
}

const empty: StoreShape = { users: [], sessions: [], threads: [], messages: [], orders: [], ratings: [] };
const store: StoreShape = structuredClone(empty);

const dataDir = process.env.LOCAL_DATA_DIR ?? path.join(process.cwd(), '.opencaribe');
const dataFile = path.join(dataDir, 'local-store.json');

let loaded = false;
let writing = false;

async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    store.users = Array.isArray(parsed.users) ? parsed.users : [];
    store.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
    store.threads = Array.isArray(parsed.threads) ? parsed.threads : [];
    store.messages = Array.isArray(parsed.messages) ? parsed.messages : [];
    store.orders = Array.isArray(parsed.orders) ? parsed.orders : [];
    store.ratings = Array.isArray(parsed.ratings) ? parsed.ratings : [];
  } catch {
    // Missing or unreadable file: start fresh.
  }
  loaded = true;
}

async function persist(): Promise<void> {
  if (writing) return;
  writing = true;
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const temporary = `${dataFile}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(store));
    await fs.rename(temporary, dataFile);
  } catch {
    // Read-only filesystem (e.g. serverless): memory stays authoritative.
  } finally {
    writing = false;
  }
}

function id(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString('hex')}`;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString('hex');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<LocalUser | undefined> {
  await ensureLoaded();
  const target = normalizeEmail(email);
  return store.users.find((user) => user.email === target);
}

export async function createUser(input: { name: string; email: string; password: string }): Promise<LocalUser> {
  await ensureLoaded();
  const email = normalizeEmail(input.email);
  if (store.users.some((user) => user.email === email)) {
    throw new Error('EMAIL_TAKEN');
  }
  const salt = randomBytes(16).toString('hex');
  const user: LocalUser = {
    id: id('user'),
    email,
    name: input.name.trim(),
    salt,
    passwordHash: hashPassword(input.password, salt),
    walletAddress: undefined,
    role: isAdminEmail(email) ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await persist();
  return user;
}

export async function verifyUser(email: string, password: string): Promise<LocalUser | undefined> {
  const user = await findUserByEmail(email);
  if (!user) return undefined;
  const candidate = Buffer.from(hashPassword(password, user.salt), 'hex');
  const expected = Buffer.from(user.passwordHash, 'hex');
  if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) return undefined;
  return user;
}

export async function createSession(userId: string): Promise<LocalSession> {
  await ensureLoaded();
  const session: LocalSession = {
    token: randomBytes(32).toString('hex'),
    userId,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  store.sessions.push(session);
  await persist();
  return session;
}

export async function getUserBySession(token: string | undefined): Promise<LocalUser | undefined> {
  if (!token) return undefined;
  await ensureLoaded();
  const session = store.sessions.find((entry) => entry.token === token);
  if (!session) return undefined;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    store.sessions = store.sessions.filter((entry) => entry.token !== token);
    await persist();
    return undefined;
  }
  return store.users.find((user) => user.id === session.userId);
}

export async function getUserById(userId: string): Promise<LocalUser | undefined> {
  await ensureLoaded();
  return store.users.find((user) => user.id === userId);
}

/** Resolves a listing sellerId ("user:id" / "wallet:addr") to a display label. */
export async function describeSeller(sellerId: string): Promise<string> {
  if (sellerId.startsWith('user:')) {
    const user = await getUserById(sellerId.slice(5));
    return user?.name ?? sellerId;
  }
  if (sellerId.startsWith('wallet:')) {
    const address = sellerId.slice(7);
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }
  return sellerId;
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  await ensureLoaded();
  store.sessions = store.sessions.filter((entry) => entry.token !== token);
  await persist();
}

export async function setUserRole(userId: string, role: 'user' | 'moderator' | 'admin'): Promise<void> {
  await ensureLoaded();
  const user = store.users.find((entry) => entry.id === userId);
  if (user) {
    user.role = role;
    await persist();
  }
}

export async function attachWallet(userId: string, walletAddress: string): Promise<void> {
  await ensureLoaded();
  const user = store.users.find((entry) => entry.id === userId);
  if (user) {
    user.walletAddress = walletAddress;
    await persist();
  }
}

/** Returns the existing thread for this listing pair or creates one. */
export async function openThread(listingId: string, buyerId: string, sellerId: string): Promise<LocalThread> {
  await ensureLoaded();
  const existing = store.threads.find(
    (thread) =>
      thread.listingId === listingId &&
      thread.participantIds.includes(buyerId) &&
      thread.participantIds.includes(sellerId),
  );
  if (existing) return existing;

  const thread: LocalThread = {
    id: id('thread'),
    listingId,
    participantIds: [sellerId, buyerId],
    createdAt: new Date().toISOString(),
  };
  store.threads.push(thread);
  await persist();
  return thread;
}

export async function listThreadsForUser(userId: string): Promise<LocalThread[]> {
  await ensureLoaded();
  return store.threads
    .filter((thread) => thread.participantIds.includes(userId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getThreadForUser(threadId: string, userId: string): Promise<LocalThread | undefined> {
  await ensureLoaded();
  const thread = store.threads.find((entry) => entry.id === threadId);
  return thread && thread.participantIds.includes(userId) ? thread : undefined;
}

export async function listMessages(threadId: string): Promise<LocalMessage[]> {
  await ensureLoaded();
  return store.messages
    .filter((message) => message.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendMessage(threadId: string, fromId: string, body: string): Promise<LocalMessage | undefined> {
  const thread = store.threads.find((entry) => entry.id === threadId);
  if (!thread || !thread.participantIds.includes(fromId)) return undefined;
  const trimmed = body.trim();
  if (trimmed.length === 0 || trimmed.length > 2000) return undefined;
  const message: LocalMessage = {
    id: id('msg'),
    threadId,
    fromId,
    toId: thread.participantIds.find((participant) => participant !== fromId) ?? '',
    body: trimmed,
    createdAt: new Date().toISOString(),
    read: false,
  };
  store.messages.push(message);
  await persist();
  return message;
}

export async function markThreadRead(threadId: string, readerId: string): Promise<void> {
  await ensureLoaded();
  for (const message of store.messages) {
    if (message.threadId === threadId && message.toId === readerId) message.read = true;
  }
  await persist();
}

export async function createOrder(input: {
  listingId: string;
  buyerAddress: string;
  sellerAddress: string;
  amountMinor: number;
  currency: string;
  txHash: string;
  status: 'confirmed' | 'pending';
}): Promise<LocalOrder> {
  await ensureLoaded();
  const order: LocalOrder = { id: id('order'), createdAt: new Date().toISOString(), ...input };
  store.orders.push(order);
  await persist();
  return order;
}

export async function listOrders(): Promise<LocalOrder[]> {
  await ensureLoaded();
  return [...store.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function rateSeller(input: {
  sellerId: string;
  reviewerId: string;
  listingId?: string;
  score: number;
  comment?: string;
}): Promise<LocalRating | undefined> {
  await ensureLoaded();
  const sellerIdentity = input.sellerId.startsWith('user:') ? input.sellerId.slice(5) : input.sellerId;
  if (sellerIdentity === input.reviewerId) return undefined;
  const score = Math.round(input.score);
  if (!Number.isFinite(score) || score < 1 || score > 5) return undefined;
  const comment = input.comment?.trim().slice(0, 1000) || undefined;

  const existing = store.ratings.find(
    (rating) => rating.sellerId === input.sellerId && rating.reviewerId === input.reviewerId,
  );
  if (existing) {
    existing.score = score;
    existing.comment = comment;
    existing.listingId = input.listingId;
    await persist();
    return existing;
  }

  const rating: LocalRating = {
    id: id('rating'),
    sellerId: input.sellerId,
    reviewerId: input.reviewerId,
    listingId: input.listingId,
    score,
    comment,
    createdAt: new Date().toISOString(),
  };
  store.ratings.push(rating);
  await persist();
  return rating;
}

export async function listRatingsForSeller(sellerId: string): Promise<LocalRating[]> {
  await ensureLoaded();
  return store.ratings
    .filter((rating) => rating.sellerId === sellerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSellerStats(sellerId: string): Promise<SellerStats> {
  const ratings = await listRatingsForSeller(sellerId);
  if (ratings.length === 0) return { count: 0, average: 0 };
  const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
  return { count: ratings.length, average: Math.round((total / ratings.length) * 100) / 100 };
}

export function resetStoreForTests(): void {
  store.users = [];
  store.sessions = [];
  store.threads = [];
  store.messages = [];
  store.orders = [];
  store.ratings = [];
  loaded = true;
}
