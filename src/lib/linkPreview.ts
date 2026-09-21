// Build-time link previews: reads a page's Open Graph tags so link tiles fill themselves in.
// Fails soft: if the page can't be reached, the tile falls back to the domain and your own text.

export type Preview = { title?: string; text?: string; image?: string; site?: string; icon?: string };

const cache = new Map<string, Promise<Preview>>();

export function linkPreview(url: string) {
  if (!cache.has(url)) cache.set(url, load(url));
  return cache.get(url)!;
}

const decode = (s?: string) =>
  s
    ?.replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;|&#8212;|&mdash;/g, '–')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    // House style: no dashes in anything we display. Ranges become "3 to 8", the rest a comma.
    .replace(/(\d)\s*[—–]\s*(\d)/g, '$1 to $2')
    .replace(/\s*[—–]\s*/g, ', ')
    .trim();

async function load(url: string): Promise<Preview> {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio link preview)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return {};
    const html = await res.text();
    const meta = (key: string) =>
      html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'))?.[1] ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, 'i'))?.[1];
    const abs = (href?: string) => (href ? new URL(href, url).href : undefined);
    const icons = [...html.matchAll(/<link[^>]+rel=["'](?:apple-touch-icon|icon|shortcut icon)["'][^>]*>/gi)].map(
      (m) => m[0].match(/href=["']([^"']+)["']/i)?.[1],
    );
    return {
      title: decode(meta('og:title') ?? html.match(/<title>([^<]*)<\/title>/i)?.[1]),
      text: decode(meta('og:description') ?? meta('description')),
      image: abs(meta('og:image')),
      site: decode(meta('og:site_name')),
      icon: abs(icons.filter(Boolean).at(-1)) ?? abs('/favicon.ico'),
    };
  } catch {
    return {};
  }
}
