import { getCollection, type CollectionEntry } from 'astro:content';

export type Company = CollectionEntry<'companies'>;

/** Prefix a site path with the configured base. */
export function url(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

export async function companies() {
  return (await getCollection('companies')).sort((a, b) => a.data.order - b.data.order);
}

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const toDate = (m: string) => new Date(`${m}-01T00:00:00Z`);

export function period(start: string, end?: string) {
  return `${fmt.format(toDate(start))} → ${end ? fmt.format(toDate(end)) : 'now'}`;
}

export function years(start: string, end?: string) {
  const a = start.slice(0, 4);
  const b = end ? end.slice(0, 4) : 'now';
  return a === b ? a : `${a} → ${b}`;
}

const markFiles = import.meta.glob<{ default: ImageMetadata }>('../content/companies/marks/*.{svg,png,jpg,jpeg,webp}', { eager: true });

/** Mark image for a company, matched by filename. */
export function markFor(slug: string) {
  return Object.entries(markFiles).find(([p]) => p.split('/').pop()!.replace(/\.\w+$/, '') === slug)?.[1].default;
}

const riveFiles = import.meta.glob<string>('../content/companies/rive/*.riv', { query: '?url', import: 'default', eager: true });

/** URL of a Rive file, matched by filename ("./rive/penguin.riv" or "penguin"). */
export function riveFor(ref: string) {
  const name = ref.split('/').pop()!.replace(/\.riv$/, '');
  return Object.entries(riveFiles).find(([p]) => p.split('/').pop()!.replace(/\.riv$/, '') === name)?.[1];
}
