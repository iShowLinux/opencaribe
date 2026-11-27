import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Card, SectionTitle } from '@opencaribe/ui';
import { MessageComposer } from '@/components/MessageComposer';
import { loadThread } from '@/app/message-actions';
import { getListingById } from '@/lib/listings-store';
import { getT } from '@/lib/t';
import { TranslateButton } from '@/components/TranslateButton';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@opencaribe/configuration';

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ country: string; threadId: string }>;
}) {
  const { country, threadId } = await params;
  const locale = (await getLocale()) as Locale;
  const translateTarget: 'en' | 'es' = locale === 'en' ? 'es' : 'en';
  const base = country.toLowerCase();
  const t = await getT();
  const { user, thread, messages, otherLabel } = await loadThread(threadId);
  if (!user) notFound();
  if (!thread) notFound();

  const listing = await getListingById(thread.listingId);

  return (
    <Container className="max-w-3xl py-10">
      <Link href={`/${base}/messages`} className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-300">
        ← {t('messages.backToThreads')}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle>{otherLabel}</SectionTitle>
          {listing && (
            <Link href={`/${base}/l/${listing.id}`} className="mt-1 block text-sm text-teal-700 hover:underline dark:text-teal-300">
              {t('messages.aboutListing')} {listing.title}
            </Link>
          )}
        </div>
      </div>

      <Card className="mt-6 p-5">
        <ol className="grid gap-3">
          {messages.map((message) => {
            const own = message.fromId === user.id;
            return (
              <li key={message.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[75%] ${own ? 'rounded-br-sm bg-teal-700 text-white dark:bg-teal-500 dark:text-slate-950' : 'rounded-bl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}>
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  <p className={`mt-1 text-[10px] ${own ? 'text-white/70 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'}`}>
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                  <TranslateButton text={message.body} target={translateTarget} />
                </div>
              </li>
            );
          })}
          {messages.length === 0 && <li className="text-sm text-slate-500 dark:text-slate-400">{t('messages.noMessages')}</li>}
        </ol>

        <MessageComposer threadId={threadId} />
      </Card>
    </Container>
  );
}
