import { redirect } from 'next/navigation';

/** Root search forwards to the global browse board, preserving the query. */
export default async function SearchRedirect({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = '', category = '' } = await searchParams;
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  const qs = params.toString();
  redirect(qs ? `/browse?${qs}` : '/browse');
}
