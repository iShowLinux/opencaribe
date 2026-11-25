import { getLocale } from 'next-intl/server';
import { type Locale } from '@opencaribe/configuration';
import { notFound } from 'next/navigation';
import { Container } from '@opencaribe/ui';
import { findLegalDocument, LEGAL_DOCUMENTS } from '@/lib/legal';
import { getT } from '@/lib/t';

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((document) => ({ slug: document.slug }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = findLegalDocument(slug);
  if (!document) notFound();
  const locale = (await getLocale()) as Locale;
  const t = await getT();

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t(document.titleKey)}</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t('legal.placeholder')}</p>
      <div className="mt-8 space-y-8">
        {document.content[locale].map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold text-navy-900 dark:text-navy-50">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{section.body}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
