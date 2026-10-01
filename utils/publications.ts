/** Section headings on /publications, in display order. */
export const publicationTypes = {
  'journal': 'Journal Articles',
  'conference': 'International Conferences',
  'national-conference': 'National Conferences',
} as const

export type PublicationType = keyof typeof publicationTypes

/** Frontmatter of content/publications/*.md */
export interface Publication {
  _path?: string
  title: string
  authors: string[]
  venue?: string
  year: number | string
  type?: PublicationType
  abbr?: string
  /** Logo or cover filename under public/img/ */
  preview?: string
  pdf?: string
  doi?: string
  url?: string
  /** Conference or journal website */
  venueUrl?: string
  /** Source code repository */
  code?: string
  jcr?: { quartile: string, impactFactor: number }
  bibtex?: string
  selected?: boolean
}

/** Anchor id on /publications (the markdown file name), e.g. "2025-esorics-digital-twin". */
export const publicationId = (pub: Pick<Publication, '_path'>) => pub._path?.split('/').pop() ?? ''

/** Where the title and cover take the reader: DOI first, then the publisher page, then the PDF. */
export const publicationLink = (pub: Publication) =>
  pub.doi ? `https://doi.org/${pub.doi}` : (pub.url ?? pub.pdf ?? pub.venueUrl)

/** Short label for links from other pages, e.g. "ESORICS 2025". */
export const publicationLabel = (pub: Pick<Publication, 'abbr' | 'title' | 'year'>) => {
  const abbr = pub.abbr ?? pub.title
  return /\d{4}/.test(abbr) ? abbr : `${abbr} ${pub.year}`
}

const typeOrder = Object.keys(publicationTypes)

/** Newest year first; within a year, journals before conferences. */
export const sortPublications = <T extends Publication>(items: T[]) =>
  [...items].sort(
    (a, b) =>
      Number(b.year) - Number(a.year)
      || typeOrder.indexOf(a.type ?? '') - typeOrder.indexOf(b.type ?? ''),
  )
