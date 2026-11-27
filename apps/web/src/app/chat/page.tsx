import { notFound } from 'next/navigation';
import { Card, Container, SectionTitle } from '@opencaribe/ui';
import { getCurrentUser } from '@/lib/session';
import { getT } from '@/lib/t';
import { ChatRoom } from '@/components/ChatRoom';

export default async function ChatPage() {
  const t = await getT();
  const user = await getCurrentUser();
  if (!user) notFound();

  return (
    <Container className="max-w-2xl py-12">
      <SectionTitle>{t('chat.title')}</SectionTitle>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('chat.subtitle')}</p>
      <Card className="mt-6 p-5">
        <ChatRoom />
      </Card>
    </Container>
  );
}
