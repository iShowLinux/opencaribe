import { describe, expect, it } from 'vitest';

import { createDraft, getAllListings } from '../../apps/web/src/lib/listings-store';
import { displayAddress, isGnoAddress } from '../../apps/web/src/lib/wallet';

const baseInput = {
  title: 'Used bicycle',
  description: 'A sturdy second-hand bicycle, ready to ride.',
  countryCode: 'TT',
  regionId: 'tt-port-of-spain',
  cityId: 'port-of-spain',
  categoryId: 'vehicles',
  subcategoryId: 'bicycles',
  price: '450',
  currency: 'TTD' as const,
  priceType: 'fixed' as const,
  negotiable: false,
  condition: 'good' as const,
  attributes: {},
  contactPreference: 'in_app_messages',
  imageKeys: [],
};

describe('wallet identity helpers', () => {
  it('accepts gno.land addresses and rejects everything else', () => {
    const address = 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5';
    expect(isGnoAddress(address)).toBe(true);
    expect(isGnoAddress(`${address}0`)).toBe(false);
    expect(isGnoAddress('0x1234')).toBe(false);
    expect(isGnoAddress('')).toBe(false);
  });

  it('shortens addresses for display', () => {
    expect(displayAddress('g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5')).toBe('g1jg8m…sqf5');
    expect(displayAddress('short')).toBe('short');
  });
});

describe('wallet posting storage rules', () => {
  it('publishes wallet posts as active with the wallet as seller', async () => {
    const listing = createDraft({
      ...baseInput,
      status: 'active',
      walletAddress: 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5',
    });
    expect(listing.status).toBe('active');
    expect(listing.sellerId).toBe('wallet:g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5');
    expect(listing.walletAddress).toBe('g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5');

    const publicListings = await getAllListings();
    expect(publicListings.some((item) => item.id === listing.id)).toBe(true);
  });

  it('keeps anonymous submissions out of the public feed until reviewed', async () => {
    const listing = createDraft({ ...baseInput, title: 'Review pending scooter', status: 'pending_review' });
    expect(listing.status).toBe('pending_review');
    expect(listing.sellerId).toBe('anonymous-draft');

    const publicListings = await getAllListings();
    expect(publicListings.some((item) => item.id === listing.id)).toBe(false);
  });
});
