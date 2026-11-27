/**
 * Caribbean current-events headlines from United States news outlets.
 * Feeds are official publisher RSS endpoints; items are filtered to the
 * Caribbean basin (plus Venezuela) so the board stays on-topic.
 */
export interface FetchedArticle {
  outlet: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
}

const FEEDS: Array<{ outlet: string; url: string }> = [
  { outlet: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml' },
  { outlet: 'The Washington Post', url: 'https://feeds.washingtonpost.com/rss/world' },
  { outlet: 'CBS News', url: 'https://www.cbsnews.com/latest/rss/world' },
  { outlet: 'NPR', url: 'https://feeds.npr.org/1004/rss' },
];

const KEYWORDS = [
  'caribbean', 'haiti', 'cuba', 'jamaica', 'dominican', 'puerto rico', 'trinidad',
  'tobago', 'bahamas', 'guyana', 'barbados', 'belize', 'grenada', 'saint lucia',
  'st. lucia', 'saint vincent', 'antigua', 'dominica', 'st. kitts', 'nevis',
  'virgin islands', 'venezuela', 'caricom', 'havana', 'port-au-prince', 'kingston',
];

function matches(text: string): boolean {
  const haystack = text.toLowerCase();
  return KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[(.+?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, '')
    .trim();
}

async function fetchFeed(outlet: string, url: string): Promise<FetchedArticle[]> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(9000), headers: { 'user-agent': 'OpenCaribe/1.0' } });
    if (!response.ok) return [];
    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    const articles: FetchedArticle[] = [];
    for (const item of items.slice(0, 40)) {
      const block = item[1] ?? '';
      const pick = (tag: string) => {
        const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(block);
        return match ? decode(match[1] ?? '') : '';
      };
      const title = pick('title');
      const link = pick('link');
      const description = pick('description') || pick('summary');
      const date = pick('pubDate') || pick('dc:date');
      if (!title || !link) continue;
      if (!matches(`${title} ${description}`)) continue;
      const published = Date.parse(date) > 0 ? new Date(date).toISOString() : new Date().toISOString();
      articles.push({ outlet, title, url: link, summary: description.slice(0, 280), publishedAt: published });
      if (articles.length >= 6) break;
    }
    return articles;
  } catch {
    return [];
  }
}

export async function fetchCaribbeanHeadlines(): Promise<FetchedArticle[]> {
  const results = await Promise.all(FEEDS.map((feed) => fetchFeed(feed.outlet, feed.url)));
  return results.flat().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 40);
}
