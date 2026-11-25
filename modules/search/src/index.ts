export interface SearchableListing {
  id: string;
  countryCode: string;
  regionId: string;
  cityId: string;
  categoryId: string;
  title: string;
  description: string;
  amountMinor: number;
  currency: string;
  condition: string;
  createdAt: Date;
  status: string;
  relevance?: number;
}

export type SortOption = 'recent' | 'relevance' | 'price_asc' | 'price_desc';

export interface SearchFilters {
  q?: string;
  country?: string;
  region?: string;
  city?: string;
  category?: string;
  currency?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  sort?: SortOption;
  page?: number;
}

export interface SearchResult<T extends SearchableListing> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  currencies: string[];
}

const PAGE_SIZE = 24;

function parseMinor(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  const [whole, fraction = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

function matchesQuery(listing: SearchableListing, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return `${listing.title} ${listing.description}`.toLocaleLowerCase().includes(needle);
}

/**
 * Pure, bounded search. Price ordering is always grouped by currency: amounts
 * in different currencies are never compared as if they shared a value.
 */
export function applySearchFilters<T extends SearchableListing>(
  listings: readonly T[],
  filters: SearchFilters = {},
  pageSize = PAGE_SIZE,
): SearchResult<T> {
  const min = parseMinor(filters.minPrice);
  const max = parseMinor(filters.maxPrice);

  const filtered = listings.filter((listing) => {
    if (listing.status !== 'active') return false;
    if (filters.country && listing.countryCode !== filters.country) return false;
    if (filters.region && listing.regionId !== filters.region) return false;
    if (filters.city && listing.cityId !== filters.city) return false;
    if (filters.category && listing.categoryId !== filters.category) return false;
    if (filters.currency && listing.currency !== filters.currency) return false;
    if (filters.condition && listing.condition !== filters.condition) return false;
    if (min !== undefined && listing.amountMinor < min) return false;
    if (max !== undefined && listing.amountMinor > max) return false;
    if (filters.q && !matchesQuery(listing, filters.q)) return false;
    return true;
  });

  const sort = filters.sort ?? 'recent';
  const sorted = [...filtered];
  if (sort === 'recent') {
    sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (sort === 'relevance') {
    sorted.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0) || b.createdAt.getTime() - a.createdAt.getTime());
  } else if (sort === 'price_asc' || sort === 'price_desc') {
    sorted.sort((a, b) => {
      const byCurrency = a.currency.localeCompare(b.currency);
      if (byCurrency !== 0) return byCurrency;
      return sort === 'price_asc'
        ? a.amountMinor - b.amountMinor
        : b.amountMinor - a.amountMinor;
    });
  }

  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const size = Math.max(1, Math.min(pageSize, 100));
  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const safePage = Math.min(page, pageCount);
  const items = sorted.slice((safePage - 1) * size, safePage * size);
  const currencies = [...new Set(sorted.map((listing) => listing.currency))].sort();

  return { items, total: sorted.length, page: safePage, pageCount, currencies };
}
