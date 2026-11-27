"use server";

/** Server-side translation proxy (Google gtx endpoint, no key required). */
export async function translateText(text: string, target: 'en' | 'es'): Promise<string | null> {
  const trimmed = text.trim().slice(0, 500);
  if (!trimmed) return null;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' });
    if (!response.ok) return null;
    const payload = (await response.json()) as Array<Array<[string, ...unknown[]]>>;
    const segments = payload?.[0];
    if (!Array.isArray(segments)) return null;
    return segments.map((segment) => String(segment[0] ?? '')).join('');
  } catch {
    return null;
  }
}
