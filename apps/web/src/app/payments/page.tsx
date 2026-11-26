import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { CryptoPaymentCard } from '@/components/CryptoPaymentCard';
import { getT } from '@/lib/t';

export default async function PaymentsPage() {
  const t = await getT();

  return (
    <Container className="max-w-3xl py-12">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('payment.pageTitle')}</h1>
        <Badge tone="warning">{t('payment.comingSoon')}</Badge>
      </div>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{t('payment.pageIntro')}</p>

      <div className="mt-8">
        <CryptoPaymentCard />
      </div>

      <Card className="mt-6 p-6">
        <SectionTitle className="text-xl">{t('payment.stepsTitle')}</SectionTitle>
        <ol className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {(['step1', 'step2', 'step3'] as const).map((key, index) => (
            <li key={key} className="flex gap-3">
              <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{index + 1}</span>
              <span>{t(`payment.${key}`)}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="mt-6 border-coral-200 p-6">
        <SectionTitle className="text-xl">{t('payment.safeTitle')}</SectionTitle>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t('payment.safeNote')}</p>
      </Card>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        {t('payment.walletName')} · {t('payment.sellerNote')}
      </p>
    </Container>
  );
}
