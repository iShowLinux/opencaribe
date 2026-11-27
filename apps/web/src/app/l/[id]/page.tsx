import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { getListingById } from '@/lib/listings-store';

/** Canonical-market redirect so any cross-country link still resolves. */
export default async function ListingRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();
  redirect(`/${listing.countryCode.toLowerCase()}/l/${listing.id}`);
}
