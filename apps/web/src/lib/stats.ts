import { desc, sql } from 'drizzle-orm';
import { getDb, isDatabaseConfigured, schema } from '@opencaribe/database';

/** Records one anonymous page view. Failures are ignored so analytics never blocks a request. */
export async function recordPageView(pathname: string, country?: string, referrer?: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  try {
    const clean = pathname.slice(0, 300);
    if (!clean.startsWith('/')) return;
    await getDb().insert(schema.pageViews).values({ path: clean, country: country?.slice(0, 2), referrer: referrer?.slice(0, 300) });
  } catch {
    /* analytics is best-effort */
  }
}

export interface PageViewStats {
  total: number;
  last7Days: number;
  topPaths: Array<{ path: string; count: number }>;
}

export async function getPageViewStats(): Promise<PageViewStats> {
  if (!isDatabaseConfigured()) return { total: 0, last7Days: 0, topPaths: [] };
  const db = getDb();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [totals] = await db
    .select({ total: sql<number>`count(*)::int`, last7Days: sql<number>`count(*) filter (where ${schema.pageViews.createdAt} >= ${since})::int` })
    .from(schema.pageViews);
  const topPaths = await db
    .select({ path: schema.pageViews.path, count: sql<number>`count(*)::int` })
    .from(schema.pageViews)
    .groupBy(schema.pageViews.path)
    .orderBy(desc(sql`count(*)`))
    .limit(5);
  return { total: totals?.total ?? 0, last7Days: totals?.last7Days ?? 0, topPaths };
}
