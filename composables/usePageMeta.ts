import { site } from '~/data/site'

/** Page title and description, mirrored into the Open Graph and Twitter tags. */
export const usePageMeta = ({ title, description = site.description }: { title?: string, description?: string }) => {
  const fullTitle = title ? `${title} · ${site.name}` : site.name
  useSeoMeta({
    title,
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    twitterTitle: fullTitle,
    twitterDescription: description,
  })
}
