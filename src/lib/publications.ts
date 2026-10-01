import { getCollection, type CollectionEntry } from 'astro:content';

export type Publication = CollectionEntry<'publications'>;

/** Section headings on /publications, in display order. */
export const publicationTypes = {
  journal: 'Journal Articles',
  conference: 'International Conferences',
  'national-conference': 'National Conferences',
} as const;

const typeOrder = Object.keys(publicationTypes);

/** Newest year first; within a year, journals before conferences, then by title. */
export async function getPublications(): Promise<Publication[]> {
  const items = await getCollection('publications');
  return items.sort(
    (a, b) =>
      b.data.year - a.data.year ||
      typeOrder.indexOf(a.data.type) - typeOrder.indexOf(b.data.type) ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Short human label per publication id, e.g. "2025-esorics-digital-twin" → "ESORICS 2025". */
export async function getPublicationLabels(): Promise<Map<string, string>> {
  const items = await getCollection('publications');
  return new Map(
    items.map(({ id, data }) => {
      const abbr = data.abbr ?? data.venue;
      return [id, /\d{4}/.test(abbr) ? abbr : `${abbr} ${data.year}`];
    }),
  );
}
