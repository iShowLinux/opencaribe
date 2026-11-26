import { Button, Card, Container } from '@opencaribe/ui';
import { LinkButton } from '@/components/LinkButton';
import { getT } from '@/lib/t';

export default async function AccountPage() {
  const t = await getT();
  return (
    <Container className="max-w-2xl py-12">
      <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('account.title')}</h1>
      <Card className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
        <div className="p-5"><p className="font-semibold text-navy-900 dark:text-navy-50">{t('account.profile')}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Sign in to manage your profile.</p></div>
        <div className="p-5"><p className="font-semibold text-navy-900 dark:text-navy-50">{t('account.settings')}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Language, theme and contact preferences are stored locally until your account is connected.</p></div>
        <div className="flex flex-wrap gap-3 p-5">
          <Button variant="secondary">{t('account.dataExport')}</Button>
          <Button variant="secondary" className="text-rose-700">{t('account.delete')}</Button>
          <LinkButton href="/login">{t('account.signOut')}</LinkButton>
        </div>
      </Card>
    </Container>
  );
}
