import Link from 'next/link';
import { Container, Card, SectionTitle } from '@opencaribe/ui';
import { LinkButton } from '@/components/LinkButton';
import { getCurrentUser } from '@/lib/session';
import { describeSeller, listThreadsForUser } from '@/lib/local-store';
import { getListingById } from '@/lib/listings-store';
import { getT } from '@/lib/t';

export default async function MessagesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const base = country.toLowerCase();
  const user = await getCurrentUser();
  const t = await getT();

  if (!user) {
    return (
      <Container className="max-w-md py-16">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('messages.title')}</h1>
        <Card className="mt-6 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">{t('messages.signInRequired')}</p>
          <LinkButton href="/login" className="mt-5 w-full">{t('messages.signInToMessage')}</LinkButton>
        </Card>
      </Container>
    );
  }

  const threads = await listThreadsForUser(user.id);
  const rows = await Promise.all(
    threads.map(async (thread) => {
      const otherId = thread.participantIds.find((participant) => participant !== user.id) ?? '';
      return {
        thread,
        listing: await getListingById(thread.listingId),
        otherLabel: await describeSeller(otherId.startsWith('g1') ? `wallet:${otherId}` : `user:${otherId}`),
      };
    }),
  );

  return (
    <Container className="max-w-3xl py-12">
      <SectionTitle>{t('messages.title')}</SectionTitle>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('messages.signedInAs', { name: user.name })}</p>

      <div className="mt-6 grid gap-3">
        {rows.map(({ thread, listing, otherLabel }) => (
          <Link key={thread.id} href={`/${base}/messages/${thread.id}`}>
            <Card className="flex h-full items-start justify-between gap-4 p-5 transition-colors hover:border-teal-500">
              <div>
                <p className="font-semibold text-navy-900 dark:text-navy-50">{listing?.title ?? t('messages.missingListing')}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {t('messages.withLabel')} {otherLabel}
                </p>
              </div>
              <span aria-hidden="true" className="text-slate-400">→</span>
            </Card>
          </Link>
        ))}
        {threads.length === 0 && (
          <Card className="p-10 text-center text-slate-600 dark:text-slate-400">{t('messages.empty')}</Card>
        )}
      </div>
    </Container>
  );
}
