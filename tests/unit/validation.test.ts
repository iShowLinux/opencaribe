import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '@opencaribe/configuration';
import { createListingSchema, reportListingSchema, searchFiltersSchema } from '@opencaribe/validation';

const valid = {
  title: 'A clearly described bicycle for sale',
  description: 'A well maintained bicycle in good condition. Collection in Port of Spain.',
  countryCode: 'TT',
  regionId: 'tt-port-of-spain',
  cityId: 'tt-pos-city',
  categoryId: 'motorcycles',
  subcategoryId: 'motorcycles-bikes',
  price: '1250.00',
  currency: 'TTD',
  priceType: 'fixed',
  negotiable: true,
  condition: 'good',
  attributes: {},
  contactPreference: 'in_app_messages',
  imageKeys: [],
};

describe('listing validation', () => {
  it('accepts a valid listing using country-derived limits', () => {
    expect(createListingSchema(COUNTRIES.TT).safeParse(valid).success).toBe(true);
  });

  it('rejects titles longer than the country limit', () => {
    const result = createListingSchema(COUNTRIES.TT).safeParse({ ...valid, title: 'x'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects currencies not supported in the selected country', () => {
    const result = createListingSchema(COUNTRIES.TT).safeParse({ ...valid, currency: 'VES' });
    expect(result.success).toBe(false);
  });

  it('requires zero price for free and contact listings', () => {
    const free = createListingSchema(COUNTRIES.TT).safeParse({ ...valid, priceType: 'free', price: '5' });
    const contact = createListingSchema(COUNTRIES.TT).safeParse({ ...valid, priceType: 'contact', price: '5' });
    expect(free.success).toBe(false);
    expect(contact.success).toBe(false);
    expect(createListingSchema(COUNTRIES.TT).safeParse({ ...valid, priceType: 'free', price: '0' }).success).toBe(true);
  });

  it('accepts a Venezuelan listing in VES', () => {
    const ve = {
      ...valid,
      countryCode: 'VE',
      currency: 'VES',
      regionId: 've-capital',
      cityId: 've-caracas',
      title: 'Bicicleta en buen estado, se vende',
      description: 'Bicicleta en buen estado de conservación. Se entrega en Caracas.',
    };
    expect(createListingSchema(COUNTRIES.VE).safeParse(ve).success).toBe(true);
  });
});

describe('report and search validation', () => {
  it('validates report reasons', () => {
    expect(reportListingSchema.safeParse({ listingId: 'tt-1', reason: 'fraud' }).success).toBe(true);
    expect(reportListingSchema.safeParse({ listingId: 'tt-1', reason: 'unknown' }).success).toBe(false);
  });

  it('bounds pagination and sort values', () => {
    expect(searchFiltersSchema.safeParse({ page: 1 }).success).toBe(true);
    expect(searchFiltersSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(searchFiltersSchema.safeParse({ sort: 'random' }).success).toBe(false);
  });
});
