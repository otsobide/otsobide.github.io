/** The site owner as written in publications; rendered in bold. */
export const selfAuthor = 'Parada, Javier';

/** ORCID iDs of known co-authors, keyed by the name as written in publications. */
export const authorOrcids: Record<string, string> = {
  'Parada, Javier': '0009-0003-5115-1802',
};

export const orcidUrl = (id: string) => `https://orcid.org/${id}`;
