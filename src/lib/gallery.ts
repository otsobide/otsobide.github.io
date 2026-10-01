import photos from '../data/gallery.json';
import countries from '../data/countries.json';

/*
 * src/data/gallery.json is scraped from Flickr at build time (scripts/fetch-flickr.mjs);
 * src/data/countries.json lists the tags that count as countries, with their flag codes.
 *
 * Flickr serves every photo at fixed sizes that share the same secret up to 1024px,
 * selected by a suffix: _z (640), _c (800), _b (1024). Larger sizes (_h, _k, _o) use a
 * different secret, so they are only used when the stored URL already points at them.
 */
const SIZED = /_(?:[a-z])\.(jpe?g|png)$/i;
const base = (src: string) => src.replace(SIZED, '').replace(/\.(jpe?g|png)$/i, '');
const ext = (src: string) => src.match(/\.(jpe?g|png)$/i)?.[1] ?? 'jpg';

/** ~800px version for the grid. */
export const thumbUrl = (src: string) => `${base(src)}_c.${ext(src)}`;

/** Largest version we can safely build for the lightbox. */
export const fullUrl = (src: string) =>
  /_[hko]\.(jpe?g|png)$/i.test(src) ? src : `${base(src)}_b.${ext(src)}`;

interface ScrapedPhoto {
  title: string;
  image: string;
  link?: string;
  tags: string[];
  date?: string;
  width?: number;
  height?: number;
}

export interface GalleryPhoto {
  title: string;
  page: string;
  thumb: string;
  full: string;
  width: number;
  height: number;
  date?: string;
}

export interface GalleryCountry {
  slug: string;
  name: string;
  /** ISO 3166 code, rendered by the Flag component. */
  flag: string;
  photos: GalleryPhoto[];
}

const countryInfo = countries as Record<string, { name: string; flag: string }>;

/** Countries with photos, most photographed first; untagged photos go last under "Elsewhere". */
export function getGallery(): GalleryCountry[] {
  const groups = new Map<string, GalleryCountry>();
  for (const p of photos as ScrapedPhoto[]) {
    const tag = p.tags.find((t) => countryInfo[t]) ?? 'elsewhere';
    const info = countryInfo[tag] ?? { name: 'Elsewhere', flag: '' };
    if (!groups.has(tag)) groups.set(tag, { slug: tag, name: info.name, flag: info.flag, photos: [] });
    groups.get(tag)!.photos.push({
      // Flickr titles default to "Untitled"; the country reads better.
      title: p.title && p.title !== 'Untitled' ? p.title : info.name,
      page: p.link ?? p.image,
      thumb: thumbUrl(p.image),
      full: fullUrl(p.image),
      width: p.width ?? 1024,
      height: p.height ?? 683,
      date: p.date,
    });
  }
  return [...groups.values()].sort(
    (a, b) => Number(a.slug === 'elsewhere') - Number(b.slug === 'elsewhere') || b.photos.length - a.photos.length,
  );
}
