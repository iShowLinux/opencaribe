import { z } from 'zod';
import type { CountryConfig } from '@opencaribe/configuration';

export const priceTypeSchema = z.enum(['fixed', 'negotiable', 'free', 'contact']);
export type PriceType = z.infer<typeof priceTypeSchema>;

export const listingStatusSchema = z.enum([
  'draft', 'pending_review', 'active', 'rejected', 'sold', 'expired', 'suspended', 'removed',
]);
export type ListingStatus = z.infer<typeof listingStatusSchema>;

export const moderationStatusSchema = z.enum(['unmoderated', 'pending', 'approved', 'rejected']);
export type ModerationStatus = z.infer<typeof moderationStatusSchema>;

export const itemConditionSchema = z.enum(['new', 'like_new', 'good', 'fair', 'for_parts']);
export type ItemCondition = z.infer<typeof itemConditionSchema>;

export const contactPreferenceSchema = z.enum(['in_app_messages', 'phone', 'email']);
export type ContactPreference = z.infer<typeof contactPreferenceSchema>;

const decimalAmount = z
  .string()
  .trim()
  .regex(/^\d+(?:[.,]\d{1,2})?$/, 'Enter an amount using at most two decimal places.');

export interface CreateListingInput {
  title: string;
  description: string;
  countryCode: string;
  regionId: string;
  cityId: string;
  categoryId: string;
  subcategoryId: string;
  price: string;
  currency: string;
  priceType: PriceType;
  negotiable: boolean;
  condition: ItemCondition;
  attributes: Record<string, string>;
  contactPreference: ContactPreference;
  imageKeys: string[];
}

/** Country-aware schema: lengths and currencies come from configuration, not hardcoded logic. */
export function createListingSchema(country: CountryConfig) {
  return z.object({
    title: z.string().trim().min(8).max(country.featureFlags.maxListingTitleLength),
    description: z.string().trim().min(20).max(country.featureFlags.maxListingDescriptionLength),
    countryCode: z.literal(country.code),
    regionId: z.string().min(1),
    // Region-level location is enough; exact city is optional.
    cityId: z.string(),
    categoryId: z.string().min(1),
    subcategoryId: z.string().min(1),
    price: decimalAmount,
    currency: z.enum(
      country.supportedCurrencies as [string, ...string[]],
    ),
    priceType: priceTypeSchema,
    negotiable: z.boolean(),
    condition: itemConditionSchema,
    attributes: z.record(z.string(), z.string()),
    contactPreference: contactPreferenceSchema,
    imageKeys: z.array(z.string()).max(country.featureFlags.maxImagesPerListing),
  }).superRefine((value, ctx) => {
    if (value.priceType === 'free' && Number(value.price.replace(',', '.')) !== 0) {
      ctx.addIssue({ code: 'custom', path: ['price'], message: 'A free listing must have a price of zero.' });
    }
    if (value.priceType === 'contact' && Number(value.price.replace(',', '.')) !== 0) {
      ctx.addIssue({ code: 'custom', path: ['price'], message: 'Contact-for-price listings must have a price of zero.' });
    }
    if ((value.priceType === 'fixed' || value.priceType === 'negotiable') && Number(value.price.replace(',', '.')) <= 0) {
      ctx.addIssue({ code: 'custom', path: ['price'], message: 'Enter a price greater than zero.' });
    }
  });
}

export const reportListingSchema = z.object({
  listingId: z.string().min(1),
  reason: z.enum(['prohibited', 'fraud', 'misleading', 'spam', 'safety', 'other']),
  details: z.string().trim().max(2000).optional(),
});

export const searchFiltersSchema = z.object({
  q: z.string().trim().max(200).optional(),
  country: z.string().length(2).optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  currency: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  condition: itemConditionSchema.optional(),
  sort: z.enum(['recent', 'relevance', 'price_asc', 'price_desc']).default('recent'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});
