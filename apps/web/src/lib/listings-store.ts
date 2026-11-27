import { desc, eq } from 'drizzle-orm';
import { getDb, isDatabaseConfigured, schema } from '@opencaribe/database';
import { parseMoneyToMinor, type CurrencyCode } from '@opencaribe/configuration';
import { ensureSellerUser } from './db-store';
import type { ItemCondition, PriceType } from '@opencaribe/validation';
import { demoListings } from './demo-data';
import type { PublicListing } from './types';

const store = new Map<string, PublicListing>(demoListings.map((listing) => [listing.id, listing]));

function mapDbRow(row: typeof schema.listings.$inferSelect): PublicListing {
  return {
    id: row.id,
    sellerId: row.sellerId,
    countryCode: row.countryCode,
    regionId: row.regionId,
    cityId: row.cityId,
    categoryId: row.categoryId,
    subcategoryId: row.subcategoryId ?? '',
    title: row.title,
    description: row.description,
    amountMinor: row.amountMinor,
    currency: row.currency as CurrencyCode,
    priceType: row.priceType as PriceType,
    negotiable: row.negotiable,
    condition: row.condition as ItemCondition,
    attributes: row.attributes ?? {},
    createdAt: row.createdAt,
    viewsCount: row.viewsCount,
    status: row.status,
  };
}

/** Reads from PostgreSQL when configured, otherwise serves deterministic demo data. */
export async function getAllListings(): Promise<PublicListing[]> {
  if (isDatabaseConfigured()) {
    try {
      const rows = await getDb()
        .select()
        .from(schema.listings)
        .where(eq(schema.listings.status, 'active'))
        .limit(200);
      return rows.map(mapDbRow);
    } catch {
      return [...store.values()].filter((listing) => listing.status === 'active');
    }
  }
  return [...store.values()].filter((listing) => listing.status === 'active');
}

export async function getListingById(id: string): Promise<PublicListing | undefined> {
  const local = store.get(id);
  if (local) return local;
  if (isDatabaseConfigured()) {
    try {
      const rows = await getDb().select().from(schema.listings).where(eq(schema.listings.id, id)).limit(1);
      return rows[0] ? mapDbRow(rows[0]) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export interface DraftInput {
  title: string;
  description: string;
  countryCode: string;
  regionId: string;
  cityId: string;
  categoryId: string;
  subcategoryId: string;
  price: string;
  currency: CurrencyCode;
  priceType: PriceType;
  negotiable: boolean;
  condition: ItemCondition;
  attributes: Record<string, string>;
  contactPreference: string;
  imageKeys: string[];
  status?: 'draft' | 'pending_review' | 'active';
  sellerId?: string;
  walletAddress?: string;
}

/** Phase 0 creates an in-memory draft; database persistence lands with the auth integration. */
export function createDraft(input: DraftInput): PublicListing {
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const id = input.status === 'active' || input.walletAddress ? `listing-${suffix}` : `draft-${suffix}`;
  const [whole, fraction = ''] = input.price.replace(',', '.').split('.');
  const draft: PublicListing = {
    id,
    sellerId: input.sellerId ?? (input.walletAddress ? `wallet:${input.walletAddress}` : 'anonymous-draft'),
    countryCode: input.countryCode,
    regionId: input.regionId,
    cityId: input.cityId,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    title: input.title,
    description: input.description,
    amountMinor: Number(whole) * 100 + Number(fraction.padEnd(2, '0')),
    currency: input.currency,
    priceType: input.priceType,
    negotiable: input.negotiable,
    condition: input.condition,
    attributes: input.attributes,
    createdAt: new Date(),
    viewsCount: 0,
    status: input.status ?? 'draft',
    walletAddress: input.walletAddress,
  };
  store.set(id, draft);
  return draft;
}

/**
 * Persists a listing when PostgreSQL is configured, otherwise keeps the
 * in-memory demo behaviour. Wallet/anonymous sellers get synthetic user rows
 * so the listings.seller_id foreign key stays valid.
 */
export async function persistListing(input: DraftInput): Promise<PublicListing> {
  if (!isDatabaseConfigured()) return createDraft(input);

  const sellerId = input.sellerId ?? (input.walletAddress ? `wallet:${input.walletAddress}` : 'anonymous-draft');
  await ensureSellerUser(sellerId);

  const [row] = await getDb()
    .insert(schema.listings)
    .values({
      sellerId,
      countryCode: input.countryCode,
      regionId: input.regionId,
      cityId: input.cityId || '',
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId || null,
      title: input.title,
      description: input.description,
      amountMinor: parseMoneyToMinor(input.price, input.currency),
      currency: input.currency,
      priceType: input.priceType,
      negotiable: input.negotiable,
      condition: input.condition,
      attributes: input.attributes,
      contactPreference: input.contactPreference,
      status: input.status ?? 'draft',
    })
    .returning();
  if (!row) throw new Error('LISTING_NOT_CREATED');
  return mapDbRow(row);
}

/** All listings owned by a seller key (used by the account dashboard). */
export async function listListingsBySeller(sellerId: string): Promise<PublicListing[]> {
  if (!isDatabaseConfigured()) {
    return [...store.values()]
      .filter((listing) => listing.sellerId === sellerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  const rows = await getDb()
    .select()
    .from(schema.listings)
    .where(eq(schema.listings.sellerId, sellerId))
    .orderBy(desc(schema.listings.createdAt));
  return rows.map(mapDbRow);
}
