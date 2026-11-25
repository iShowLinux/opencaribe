import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { toCountryCode } from '@opencaribe/configuration';

export default async function CountryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: rawCode } = await params;
  if (!toCountryCode(rawCode)) notFound();
  return <>{children}</>;
}
