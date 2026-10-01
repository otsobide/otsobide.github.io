/** The site owner as written in publication frontmatter; rendered in bold. */
export const selfAuthor = 'Parada, Javier'

/** ORCID iDs of known authors, keyed by the name as written in publication frontmatter. */
export const authorOrcids: Record<string, string> = {
  'Parada, Javier': '0009-0003-5115-1802',
}

export const orcidUrl = (id: string) => `https://orcid.org/${id}`
