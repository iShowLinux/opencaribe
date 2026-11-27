import { SellerProfile } from '@/components/SellerProfile';

/** Public seller profile across all markets. */
export default async function GlobalSellerProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <SellerProfile userId={userId} />;
}
