import Link from 'next/link';
import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getHeadlineBoard } from '@/lib/headlines';
import { getT } from '@/lib/t';

export default async function HeadlinesPage() {
  const t = await getT();
  const articles = await getHeadlineBoard();

  return (
    <Container className="py-12">
      <SectionTitle>{t('headlines.title')}</SectionTitle>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{t('headlines.subtitle')}</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.url} className="flex flex-col p-5">
            <div className="flex items-center justify-between gap-3">
              <Badge tone="neutral">{article.outlet}</Badge>
              <span className="text-xs text-slate-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <a href={article.url} target="_blank" rel="noreferrer" className="mt-3 font-semibold text-navy-900 hover:text-teal-700 hover:underline dark:text-navy-50 dark:hover:text-teal-300">
              {article.title} ↗
            </a>
            {article.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{article.summary}</p>}
          </Card>
        ))}
      </div>
      {articles.length === 0 && <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">{t('headlines.empty')}</p>}
      <p className="mt-8 text-xs text-slate-500">
        <Link href="/news" className="font-medium text-teal-700 hover:underline dark:text-teal-300">← {t('nav.news')}</Link>
      </p>
    </Container>
  );
}
