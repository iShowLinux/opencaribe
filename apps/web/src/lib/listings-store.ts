import { eq } from 'drizzle-orm';
import { getDb, isDatabaseConfigured, schema } from '@opencaribe/database';
import type { CurrencyCode } from '@opencaribe/configuration';
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
      return [...store.values()];
    }
  }
  return [...store.values()];
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
}

/** Phase 0 creates an in-memory draft; database persistence lands with the auth integration. */
export function createDraft(input: DraftInput): PublicListing {
  const id = `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const [whole, fraction = ''] = input.price.replace(',', '.').split('.');
  const draft: PublicListing = {
    id,
    sellerId: 'anonymous-draft',
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
    status: 'draft',
  };
  store.set(id, draft);
  return draft;
}
