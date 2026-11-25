import { Container } from '@opencaribe/ui';
import { getT } from '@/lib/t';

export default async function MessagesPage() {
  const t = await getT();
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('messages.title')}</h1>
      <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
        {t('messages.empty')}
      </p>
    </Container>
  );
}
