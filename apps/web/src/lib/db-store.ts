import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { and, asc, desc, eq, inArray, isNull, ne } from 'drizzle-orm';
import { getDb, schema } from '@opencaribe/database';
import type { LocalMessage, LocalOrder, LocalRating, LocalThread, LocalUser, SellerStats } from './local-store';
import { isAdminEmail } from './admin';

/**
 * PostgreSQL implementation of the demo store API. Used when DATABASE_URL is
 * configured; `lib/store.ts` picks this or the JSON/memory implementation so
 * every caller stays storage-agnostic.
 */

type UserRow = typeof schema.users.$inferSelect;
type ThreadRow = typeof schema.messageThreads.$inferSelect;

function newId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString('hex')}`;
}

function toLocalUser(row: UserRow): LocalUser {
  return {
    id: row.id,
    email: row.email ?? '',
    name: row.name ?? '',
    // Credential material lives in the accounts table; callers never need it here.
    passwordHash: '',
    salt: '',
    walletAddress: row.walletAddress ?? undefined,
    role: row.role === 'admin' || row.role === 'moderator' ? row.role : 'user',
    createdAt: row.createdAt.toISOString(),
  };
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString('hex');
}

/** Synthetic user rows keep the listings.seller_id foreign key valid for wallet/anonymous sellers. */
export async function ensureSellerUser(key: string): Promise<void> {
  const db = getDb();
  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.id, key))
    .limit(1);
  if (existing[0]) return;

  const email = `seller+${encodeURIComponent(key)}@opencaribe.invalid`;
  const name = key.startsWith('wallet:')
    ? `${key.slice(7, 13)}…${key.slice(-4)}`
    : 'Marketplace seller';
  try {
    const walletAddress = key.startsWith('wallet:') ? key.slice(7) : null;
    await db.insert(schema.users).values({ id: key, email, name, walletAddress });
  } catch {
    // Another request created it first; safe to continue.
  }
}

export async function findUserByEmail(email: string): Promise<LocalUser | undefined> {
  const normalized = email.trim().toLowerCase();
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalized))
    .limit(1);
  return rows[0] ? toLocalUser(rows[0]) : undefined;
}

export async function createUser(input: { name: string; email: string; password: string }): Promise<LocalUser> {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const id = newId('user');
  const salt = randomBytes(16).toString('hex');

  try {
    await db.insert(schema.users).values({ id, email, name: input.name.trim(), role: isAdminEmail(email) ? 'admin' : 'user' });
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) throw new Error('EMAIL_TAKEN');
    throw error;
  }

  await db.insert(schema.accounts).values({
    id: newId('acc'),
    userId: id,
    accountId: id,
    providerId: 'credential',
    password: `${salt}:${hashPassword(input.password, salt)}`,
  });

  const user = await findUserByEmail(email);
  if (!user) throw new Error('USER_NOT_CREATED');
  return user;
}

export async function verifyUser(email: string, password: string): Promise<LocalUser | undefined> {
  const user = await findUserByEmail(email);
  if (!user) return undefined;

  const rows = await getDb()
    .select()
    .from(schema.accounts)
    .where(and(eq(schema.accounts.userId, user.id), eq(schema.accounts.providerId, 'credential')))
    .limit(1);
  const stored = rows[0]?.password;
  if (!stored) return undefined;

  const [salt, expectedHash] = stored.split(':');
  if (!salt || !expectedHash) return undefined;
  const candidate = Buffer.from(hashPassword(password, salt), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) return undefined;
  return user;
}

export async function createSession(userId: string): Promise<{ token: string; userId: string; expiresAt: string }> {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const token = randomBytes(32).toString('hex');
  await getDb().insert(schema.sessions).values({
    id: newId('session'),
    userId,
    token,
    expiresAt,
  });
  return { token, userId, expiresAt: expiresAt.toISOString() };
}

export async function getUserBySession(token: string | undefined): Promise<LocalUser | undefined> {
  if (!token) return undefined;
  const db = getDb();
  const rows = await db
    .select({ user: schema.users, session: schema.sessions })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(eq(schema.sessions.token, token))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;
  if (row.session.expiresAt.getTime() < Date.now()) {
    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
    return undefined;
  }
  return toLocalUser(row.user);
}

export async function getUserById(userId: string): Promise<LocalUser | undefined> {
  const rows = await getDb().select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  return rows[0] ? toLocalUser(rows[0]) : undefined;
}

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
  await getDb().delete(schema.sessions).where(eq(schema.sessions.token, token));
}

export async function attachWallet(userId: string, walletAddress: string): Promise<void> {
  await getDb().update(schema.users).set({ walletAddress }).where(eq(schema.users.id, userId));
}

export async function setUserRole(userId: string, role: 'user' | 'moderator' | 'admin'): Promise<void> {
  await getDb().update(schema.users).set({ role }).where(eq(schema.users.id, userId));
}

async function participantsOf(threadId: string): Promise<string[]> {
  const rows = await getDb()
    .select({ userId: schema.threadParticipants.userId })
    .from(schema.threadParticipants)
    .where(eq(schema.threadParticipants.threadId, threadId));
  return rows.map((row) => row.userId);
}

function toLocalThread(thread: ThreadRow, participantIds: string[]): LocalThread {
  return {
    id: thread.id,
    listingId: thread.listingId ?? '',
    participantIds,
    createdAt: thread.createdAt.toISOString(),
  };
}

export async function openThread(listingId: string, buyerId: string, sellerId: string): Promise<LocalThread> {
  await ensureSellerUser(sellerId);
  const db = getDb();

  const threads = await db
    .select()
    .from(schema.messageThreads)
    .where(eq(schema.messageThreads.listingId, listingId));
  for (const thread of threads) {
    const participants = await participantsOf(thread.id);
    if (participants.includes(buyerId) && participants.includes(sellerId)) {
      return toLocalThread(thread, [sellerId, buyerId]);
    }
  }

  const [created] = await db
    .insert(schema.messageThreads)
    .values({ listingId })
    .returning();
  if (!created) throw new Error('THREAD_NOT_CREATED');
  await db.insert(schema.threadParticipants).values([
    { threadId: created.id, userId: sellerId },
    { threadId: created.id, userId: buyerId },
  ]);
  return toLocalThread(created, [sellerId, buyerId]);
}

export async function listThreadsForUser(userId: string): Promise<LocalThread[]> {
  const db = getDb();
  const participations = await db
    .select({ threadId: schema.threadParticipants.threadId })
    .from(schema.threadParticipants)
    .where(eq(schema.threadParticipants.userId, userId));
  if (participations.length === 0) return [];

  const threads = await db
    .select()
    .from(schema.messageThreads)
    .where(inArray(schema.messageThreads.id, participations.map((row) => row.threadId)))
    .orderBy(desc(schema.messageThreads.createdAt));

  return Promise.all(threads.map(async (thread) => toLocalThread(thread, await participantsOf(thread.id))));
}

export async function getThreadForUser(threadId: string, userId: string): Promise<LocalThread | undefined> {
  const rows = await getDb()
    .select()
    .from(schema.messageThreads)
    .where(eq(schema.messageThreads.id, threadId))
    .limit(1);
  const thread = rows[0];
  if (!thread) return undefined;
  const participants = await participantsOf(thread.id);
  return participants.includes(userId) ? toLocalThread(thread, participants) : undefined;
}

export async function listMessages(threadId: string): Promise<LocalMessage[]> {
  const rows = await getDb()
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.threadId, threadId))
    .orderBy(asc(schema.messages.createdAt));
  const participants = await participantsOf(threadId);

  return rows.map((row) => ({
    id: row.id,
    threadId,
    fromId: row.senderId,
    toId: participants.find((participant) => participant !== row.senderId) ?? '',
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    read: Boolean(row.readAt),
  }));
}

export async function sendMessage(threadId: string, fromId: string, body: string): Promise<LocalMessage | undefined> {
  const thread = await getThreadForUser(threadId, fromId);
  if (!thread) return undefined;
  const trimmed = body.trim();
  if (trimmed.length === 0 || trimmed.length > 2000) return undefined;

  const toId = thread.participantIds.find((participant) => participant !== fromId) ?? '';
  const [row] = await getDb()
    .insert(schema.messages)
    .values({ threadId, senderId: fromId, body: trimmed })
    .returning();
  if (!row) throw new Error('MESSAGE_NOT_CREATED');
  return {
    id: row.id,
    threadId,
    fromId,
    toId,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    read: false,
  };
}

export async function markThreadRead(threadId: string, readerId: string): Promise<void> {
  await getDb()
    .update(schema.messages)
    .set({ readAt: new Date() })
    .where(and(eq(schema.messages.threadId, threadId), ne(schema.messages.senderId, readerId), isNull(schema.messages.readAt)));
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
  const [row] = await getDb()
    .insert(schema.paymentOrders)
    .values({
      listingId: input.listingId,
      buyerAddress: input.buyerAddress,
      sellerAddress: input.sellerAddress,
      amountMinor: Math.round(input.amountMinor),
      currency: input.currency,
      txHash: input.txHash.toLowerCase(),
      status: input.status,
    })
    .returning();
  if (!row) throw new Error('ORDER_NOT_CREATED');
  return {
    id: row.id,
    listingId: row.listingId ?? '',
    buyerAddress: row.buyerAddress,
    sellerAddress: row.sellerAddress,
    amountMinor: Number(row.amountMinor),
    currency: row.currency,
    txHash: row.txHash,
    status: row.status === 'pending' ? 'pending' : 'confirmed',
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listOrders(): Promise<LocalOrder[]> {
  const rows = await getDb()
    .select()
    .from(schema.paymentOrders)
    .orderBy(desc(schema.paymentOrders.createdAt));
  return rows.map((row) => ({
    id: row.id,
    listingId: row.listingId ?? '',
    buyerAddress: row.buyerAddress,
    sellerAddress: row.sellerAddress,
    amountMinor: Number(row.amountMinor),
    currency: row.currency,
    txHash: row.txHash,
    status: row.status === 'pending' ? 'pending' : 'confirmed',
    createdAt: row.createdAt.toISOString(),
  }));
}

function toLocalRating(row: typeof schema.sellerRatings.$inferSelect): LocalRating {
  return {
    id: row.id,
    sellerId: row.sellerId,
    reviewerId: row.reviewerId,
    listingId: row.listingId ?? undefined,
    score: row.score,
    comment: row.comment ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function rateSeller(input: {
  sellerId: string;
  reviewerId: string;
  listingId?: string;
  score: number;
  comment?: string;
}): Promise<LocalRating | undefined> {
  const sellerIdentity = input.sellerId.startsWith('user:') ? input.sellerId.slice(5) : input.sellerId;
  if (sellerIdentity === input.reviewerId) return undefined;
  await ensureSellerUser(input.sellerId);
  const score = Math.round(input.score);
  if (!Number.isFinite(score) || score < 1 || score > 5) return undefined;
  const comment = input.comment?.trim().slice(0, 1000) || undefined;

  const [row] = await getDb()
    .insert(schema.sellerRatings)
    .values({
      sellerId: input.sellerId,
      reviewerId: input.reviewerId,
      listingId: input.listingId ?? null,
      score,
      comment,
    })
    .onConflictDoUpdate({
      target: [schema.sellerRatings.sellerId, schema.sellerRatings.reviewerId],
      set: { score, comment, listingId: input.listingId ?? null },
    })
    .returning();
  return row ? toLocalRating(row) : undefined;
}

export async function listRatingsForSeller(sellerId: string): Promise<LocalRating[]> {
  const rows = await getDb()
    .select()
    .from(schema.sellerRatings)
    .where(eq(schema.sellerRatings.sellerId, sellerId))
    .orderBy(desc(schema.sellerRatings.createdAt));
  return rows.map(toLocalRating);
}

export async function getSellerStats(sellerId: string): Promise<SellerStats> {
  const ratings = await listRatingsForSeller(sellerId);
  if (ratings.length === 0) return { count: 0, average: 0 };
  const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
  return { count: ratings.length, average: Math.round((total / ratings.length) * 100) / 100 };
}
