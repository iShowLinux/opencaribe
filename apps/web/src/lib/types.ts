import type { CurrencyCode } from '@opencaribe/configuration';
import type { ItemCondition, PriceType } from '@opencaribe/validation';

export interface PublicListing {
  id: string;
  sellerId: string;
  countryCode: string;
  regionId: string;
  cityId: string;
  categoryId: string;
  subcategoryId: string;
  title: string;
  description: string;
  amountMinor: number;
  currency: CurrencyCode;
  priceType: PriceType;
  negotiable: boolean;
  condition: ItemCondition;
  attributes: Record<string, string>;
  createdAt: Date;
  viewsCount: number;
  status: string;
}
