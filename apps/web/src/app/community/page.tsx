import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getCurrentUser } from '@/lib/session';
import { getUserById, listForumThreads } from '@/lib/store';
import { getT } from '@/lib/t';
import { NewThreadForm } from '@/components/NewThreadForm';

const CATS = [
  { id: 'events', key: 'catEvents' },
  { id: 'feedback', key: 'catFeedback' },
  { id: 'support', key: 'catSupport' },
] as const;

function catLabel(category: string): string {
  return category === 'events' ? 'catEvents' : category === 'feedback' ? 'catFeedback' : 'catSupport';
}

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const t = await getT();
  const user = await getCurrentUser();
  if (!user) notFound();

  const { category = '' } = await searchParams;
  const threads = await listForumThreads(category || undefined);
  const authors = new Map<string, string>();
  for (const thread of threads) {
    if (!authors.has(thread.authorId)) {
      const author = await getUserById(thread.authorId);
      authors.set(thread.authorId, author?.walletAddress ? `${author.name} · ${author.walletAddress.slice(0, 6)}…${author.walletAddress.slice(-4)}` : (author?.name ?? 'OpenCaribe user'));
    }
  }

  return (
    <Container className="py-12">
      <SectionTitle>{t('title')}</SectionTitle>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('subtitle')}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/community" className={`rounded-full px-3 py-1 text-sm font-medium ${!category ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
          {t('all')}
        </Link>
        {CATS.map((cat) => (
          <Link key={cat.id} href={`/community?category=${cat.id}`} className={`rounded-full px-3 py-1 text-sm font-medium ${category === cat.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            {t(cat.key)}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-3">
        {threads.map((thread) => (
          <Link key={thread.id} href={`/community/${thread.id}`}>
            <Card className="p-5 transition-colors hover:border-teal-500">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-navy-900 dark:text-navy-50">{thread.title}</h2>
                <Badge tone="neutral">{t(catLabel(thread.category))}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{thread.body}</p>
              <p className="mt-2 text-xs text-slate-500">
                {authors.get(thread.authorId)} · {new Date(thread.createdAt).toLocaleDateString()}
              </p>
            </Card>
          </Link>
        ))}
        {threads.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t('empty')}</p>}
      </div>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">{t('identityNote')}</p>

      <NewThreadForm />
    </Container>
  );
}
