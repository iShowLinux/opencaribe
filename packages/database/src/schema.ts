import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['guest', 'user', 'moderator', 'admin', 'platform_admin']);
export const listingStatusEnum = pgEnum('listing_status', [
  'draft', 'pending_review', 'active', 'rejected', 'sold', 'expired', 'suspended', 'removed',
]);
export const moderationStatusEnum = pgEnum('moderation_status', ['unmoderated', 'pending', 'approved', 'rejected']);
export const priceTypeEnum = pgEnum('price_type', ['fixed', 'negotiable', 'free', 'contact']);
export const itemConditionEnum = pgEnum('item_condition', ['new', 'like_new', 'good', 'fair', 'for_parts']);
export const reportStatusEnum = pgEnum('report_status', ['open', 'investigating', 'resolved', 'dismissed']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  name: text('name'),
  walletAddress: text('wallet_address'),
  role: userRoleEnum('role').notNull().default('user'),
  banned: boolean('banned').notNull().default(false),
  whatsapp: varchar('whatsapp', { length: 32 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [index('users_role_idx').on(table.role)]);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('sessions_user_idx').on(table.userId)]);

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  parentId: text('parent_id'),
  names: jsonb('names').$type<Record<string, string>>().notNull(),
  icon: text('icon'),
  attributes: jsonb('attributes').$type<Record<string, unknown>[]>().notNull().default([]),
  enabled: boolean('enabled').notNull().default(true),
  moderationRequired: boolean('moderation_required').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const geographyRegions = pgTable('geography_regions', {
  id: text('id').primaryKey(),
  countryCode: text('country_code').notNull(),
  names: jsonb('names').$type<Record<string, string>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('geo_regions_country_idx').on(table.countryCode)]);

export const geographyCities = pgTable('geography_cities', {
  id: text('id').primaryKey(),
  countryCode: text('country_code').notNull(),
  regionId: text('region_id').notNull().references(() => geographyRegions.id),
  names: jsonb('names').$type<Record<string, string>>().notNull(),
  approxLatitude: doublePrecision('approx_latitude'),
  approxLongitude: doublePrecision('approx_longitude'),
}, (table) => [index('geo_cities_region_idx').on(table.regionId)]);

export const geographyCommunities = pgTable('geography_communities', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull().references(() => geographyCities.id),
  names: jsonb('names').$type<Record<string, string>>().notNull(),
});

export const listings = pgTable('listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: text('seller_id').notNull().references(() => users.id),
  countryCode: text('country_code').notNull(),
  regionId: text('region_id').notNull(),
  cityId: text('city_id').notNull(),
  categoryId: text('category_id').notNull(),
  subcategoryId: text('subcategory_id'),
  imageUrl: text('image_url'),
  title: text('title').notNull(),
  description: text('description').notNull(),
  amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
  currency: text('currency').notNull(),
  priceType: priceTypeEnum('price_type').notNull(),
  negotiable: boolean('negotiable').notNull().default(false),
  condition: itemConditionEnum('condition').notNull().default('good'),
  attributes: jsonb('attributes').$type<Record<string, string>>().notNull().default({}),
  contactPreference: text('contact_preference').notNull().default('in_app_messages'),
  status: listingStatusEnum('status').notNull().default('draft'),
  moderationStatus: moderationStatusEnum('moderation_status').notNull().default('unmoderated'),
  viewsCount: integer('views_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
}, (table) => [
  index('listings_country_category_idx').on(table.countryCode, table.categoryId),
  index('listings_seller_idx').on(table.sellerId),
  index('listings_status_created_idx').on(table.status, table.createdAt),
]);

export const listingImages = pgTable('listing_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  objectKey: text('object_key').notNull().unique(),
  width: integer('width'),
  height: integer('height'),
  format: text('format').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('listing_images_listing_idx').on(table.listingId)]);

export const favorites = pgTable('favorites', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.userId, table.listingId] })]);

export const messageThreads = pgTable('message_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const threadParticipants = pgTable('thread_participants', {
  threadId: uuid('thread_id').notNull().references(() => messageThreads.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [primaryKey({ columns: [table.threadId, table.userId] })]);

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => messageThreads.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  readAt: timestamp('read_at', { withTimezone: true }),
}, (table) => [index('messages_thread_idx').on(table.threadId)]);

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  reporterId: text('reporter_id').references(() => users.id),
  reason: text('reason').notNull(),
  details: text('details'),
  status: reportStatusEnum('status').notNull().default('open'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex('reports_unique_idx').on(table.listingId, table.reporterId)]);

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: text('actor_id'),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('audit_log_created_idx').on(table.createdAt)]);

export const paymentOrders = pgTable('payment_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  buyerAddress: text('buyer_address').notNull(),
  sellerAddress: text('seller_address').notNull(),
  amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
  currency: text('currency').notNull(),
  txHash: text('tx_hash').notNull(),
  status: text('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('payment_orders_listing_idx').on(table.listingId)]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export const sellerRatings = pgTable('seller_ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: text('seller_id').notNull().references(() => users.id),
  reviewerId: text('reviewer_id').notNull().references(() => users.id),
  listingId: uuid('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  score: integer('score').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('seller_ratings_seller_reviewer_idx').on(table.sellerId, table.reviewerId),
  index('seller_ratings_seller_idx').on(table.sellerId),
]);

export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type Category = typeof categories.$inferSelect;

export type SellerRating = typeof sellerRatings.$inferSelect;

export const pageViews = pgTable('page_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  path: text('path').notNull(),
  country: varchar('country', { length: 2 }),
  referrer: text('referrer'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('page_views_created_idx').on(table.createdAt),
]);

export type PageView = typeof pageViews.$inferSelect;

export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  buyerId: text('buyer_id').notNull().references(() => users.id),
  amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
  currency: text('currency').notNull(),
  message: text('message'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('offers_listing_idx').on(table.listingId),
  index('offers_buyer_idx').on(table.buyerId),
]);

export type Offer = typeof offers.$inferSelect;

export const communityThreads = pgTable('community_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: text('author_id').notNull().references(() => users.id),
  category: text('category').notNull().default('events'),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('community_threads_created_idx').on(table.createdAt),
]);

export const communityReplies = pgTable('community_replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => communityThreads.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('community_replies_thread_idx').on(table.threadId),
]);

export const newsArticles = pgTable('news_articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  outlet: text('outlet').notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  summary: text('summary'),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('news_articles_url_idx').on(table.url),
]);

export const newsMeta = pgTable('news_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('chat_messages_created_idx').on(table.createdAt),
]);
