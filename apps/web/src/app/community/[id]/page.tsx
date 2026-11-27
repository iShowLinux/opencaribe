import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getCurrentUser } from '@/lib/session';
import { getUserById, getForumThread, listForumReplies } from '@/lib/store';
import { getT } from '@/lib/t';
import { ReplyForm } from '@/components/ReplyForm';

function catLabel(category: string): string {
  return category === 'events' ? 'catEvents' : category === 'feedback' ? 'catFeedback' : 'catSupport';
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getT();
  const user = await getCurrentUser();
  if (!user) notFound();
  const { id } = await params;
  const thread = await getForumThread(id);
  if (!thread) notFound();
  const replies = await listForumReplies(id);

  const names = new Map<string, string>();
  const authorIds = [thread.authorId, ...replies.map((reply) => reply.authorId)];
  for (const authorId of new Set(authorIds)) {
    const author = await getUserById(authorId);
    names.set(authorId, author?.walletAddress ? `${author.name} · ${author.walletAddress.slice(0, 6)}…${author.walletAddress.slice(-4)}` : (author?.name ?? 'OpenCaribe user'));
  }

  return (
    <Container className="max-w-3xl py-12">
      <Link href="/community" className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-300">← {t('title')}</Link>
      <div className="mt-4">
        <Badge tone="neutral">{t(catLabel(thread.category))}</Badge>
        <SectionTitle className="mt-2">{thread.title}</SectionTitle>
        <p className="mt-2 text-xs text-slate-500">{names.get(thread.authorId)} · {new Date(thread.createdAt).toLocaleDateString()}</p>
        <p className="mt-4 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{thread.body}</p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">{t('replies', { count: replies.length })}</h2>
        <div className="mt-4 grid gap-3">
          {replies.map((reply) => (
            <Card key={reply.id} className="p-4">
              <p className="text-xs text-slate-500">{names.get(reply.authorId)} · {new Date(reply.createdAt).toLocaleDateString()}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{reply.body}</p>
            </Card>
          ))}
          {replies.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t('noReplies')}</p>}
        </div>
      </section>

      <ReplyForm threadId={thread.id} />
    </Container>
  );
}
