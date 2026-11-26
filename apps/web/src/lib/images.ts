/**
 * Curated Unsplash photo IDs used for placeholder listing imagery.
 * All IDs are verified to resolve at images.unsplash.com. Photos are loaded
 * through next/image with the remote pattern configured in next.config.ts.
 */
const BASE = 'https://images.unsplash.com/';

export function unsplash(photoId: string, width = 900, quality = 72): string {
  return `${BASE}${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

const CATEGORY_PHOTO_IDS: Record<string, string> = {
  general: 'photo-1493663284031-b7e3aefcae8e',
  electronics: 'photo-1517336714731-489689fd1ca8',
  vehicles: 'photo-1503376780353-7e6692767b70',
  motorcycles: 'photo-1568772585407-9361f9bf3a87',
  housing: 'photo-1600585154340-be6161a56a0c',
  rentals: 'photo-1522708323590-d24dbb6b0267',
  jobs: 'photo-1521737711867-e3b97375f902',
  freelance: 'photo-1496181133206-80ce9b88a853',
  professional: 'photo-1519389950473-47ba0277781c',
  'home-improvement': 'photo-1503387762-592deb58ef4e',
  furniture: 'photo-1555041469-a586c61ea9bc',
  clothing: 'photo-1483985988355-763728e1935b',
  agricultural: 'photo-1500937386664-56d1dfef3854',
  business: 'photo-1586023492125-27b2c045efd7',
  community: 'photo-1533105079780-92b9be482077',
  events: 'photo-1511379938547-c1f69419868d',
  free: 'photo-1542291026-7eec264c27ff',
  wanted: 'photo-1546868871-7041f2a55e12',
  'lost-found': 'photo-1583394838336-acd977736f90',
  pets: 'photo-1581244277943-fe4a9c777189',
  'baby-kids': 'photo-1515488042361-ee00e0ddd4e4',
  'sports-outdoor': 'photo-1517649763962-0c623066013b',
  'musical-instruments': 'photo-1493225457124-a3eb161ffa5f',
  'books-media': 'photo-1512820790803-83ca734da794',
  'marine-boating': 'photo-1544551763-46a013bb70d5',
  'travel-tours': 'photo-1533104816931-20fa691ff6ca',
  'health-beauty': 'photo-1596462502278-27bfdc403348',
  construction: 'photo-1504307651254-35680f356dfd',
  'toys-games': 'photo-1606092195730-5d7b9af1efc5',
  'art-crafts': 'photo-1452860606245-08befc0ff44b',
  sustainability: 'photo-1464822759023-fed622ff2c3b',
};

export const HERO_PHOTO_ID = 'photo-1533105079780-92b9be482077';
export const SECONDARY_PHOTO_ID = 'photo-1507525428034-b723cf961d3e';

export function categoryImage(slug: string, width = 900): string {
  return unsplash(CATEGORY_PHOTO_IDS[slug] ?? CATEGORY_PHOTO_IDS.general ?? '', width);
}

export function heroImage(width = 1400): string {
  return unsplash(HERO_PHOTO_ID, width, 78);
}

export function secondaryImage(width = 900): string {
  return unsplash(SECONDARY_PHOTO_ID, width, 76);
}
