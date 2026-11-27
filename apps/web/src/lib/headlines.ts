import { fetchCaribbeanHeadlines } from '@/lib/news-feeds';
import { getNewsMeta, listNewsArticles, setNewsMeta, upsertNewsArticles } from './store';

const STALE_MS = 45 * 60 * 1000;

/** Refreshes the headline board from US outlets. Errors leave the last cache intact. */
export async function refreshHeadlines(): Promise<number> {
  const articles = await fetchCaribbeanHeadlines();
  await upsertNewsArticles(articles.map((article) => ({ ...article })));
  await setNewsMeta('last_fetch', new Date().toISOString());
  return articles.length;
}

/**
 * Board data: returns the cached list immediately. An empty board triggers one
 * synchronous refresh so the first visitor still sees content; afterwards the
 * hourly Vercel cron keeps it fresh.
 */
export async function getHeadlineBoard() {
  const [cached, lastFetch] = await Promise.all([listNewsArticles(60), getNewsMeta('last_fetch')]);
  const age = lastFetch ? Date.now() - Date.parse(lastFetch) : Number.POSITIVE_INFINITY;
  if (cached.length === 0 || age > STALE_MS) {
    try {
      await refreshHeadlines();
    } catch {
      /* keep stale cache on feed failure */
    }
    return listNewsArticles(60);
  }
  return cached;
}
