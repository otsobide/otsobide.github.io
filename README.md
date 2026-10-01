# javierparada.phd

Personal academic website of Javier Parada, built with [Astro](https://astro.build) on the
template of [antoniolara.phd](https://github.com/antoniol00/antoniolara.phd).

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # refreshes the Flickr gallery, then static output in dist/
npm run check    # type-check .astro and .ts files
```

## Content

- `src/data/site.ts`: name, description, contact, social links, navigation.
- `src/data/cv.ts`: CV sections (experience, education, awards, certifications, languages,
  research interests), shown on /cv in that order. Institution logos live in `src/assets/logos/`.
- `src/content/publications/*.md`: one file per publication (schema in `src/content.config.ts`).
  `type` is `journal`, `conference` or `national-conference`. Covers/logos live in
  `src/assets/publications/`; square images are shown as logos and portrait ones as journal covers.
- `src/content/activities/*.md`: one file per activity (talk, award, conference…): `date` (`YYYY-MM-DD`, or `YYYY-MM` if the day
  doesn't matter), optional `endDate` for multi-day events, `category`, `summary` (one line for the
  home page), `location`, `links`, related `publications` (file names without `.md`), optional
  `image`; the body is the detailed text.
- `src/content/projects/*.md` (page hidden for now, see `src/data/site.ts`): one file per project (`description`, `url`, `category`,
  `importance`, `stack`, optional `emoji`).
- `src/data/authors.ts`: ORCID iDs of co-authors, linked from author names.
- `src/data/gallery.json` (page hidden for now, see `src/data/site.ts`): photos scraped from the Flickr photostream by `scripts/fetch-flickr.mjs`
  (runs before every build). Photos are grouped by the country tags listed in
  `src/data/countries.json`.
- `public/pdf/cv.pdf`: downloadable CV.

## Deployment

Every push to `main` builds the site with GitHub Actions (`.github/workflows/deploy.yml`) and
publishes `dist/` to the `gh-pages` branch, served at <https://javierparada.phd>.

The share image `public/og.png` is rendered from `scripts/og-image.html` with
`npm run og:image` (needs a local Chrome/Chromium).
