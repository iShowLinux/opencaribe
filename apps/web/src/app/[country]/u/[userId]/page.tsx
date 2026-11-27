import { notFound } from 'next/navigation';
import { toCountryCode } from '@opencaribe/configuration';
import { SellerProfile } from '@/components/SellerProfile';

export default async function SellerProfilePage({ params }: { params: Promise<{ country: string; userId: string }> }) {
  const { country, userId } = await params;
  const code = toCountryCode(country);
  if (!code) notFound();
  return <SellerProfile userId={userId} countryCode={code} />;
}
