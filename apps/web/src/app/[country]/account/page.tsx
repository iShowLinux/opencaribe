import { notFound } from 'next/navigation';
import { toCountryCode } from '@opencaribe/configuration';
import { AccountDashboard } from '@/components/AccountDashboard';

export default async function AccountPage({ params }: { params: Promise<{ country: string }> }) {
  const code = toCountryCode((await params).country);
  if (!code) notFound();
  return <AccountDashboard countryCode={code} />;
}
