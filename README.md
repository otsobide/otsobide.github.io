# javierparada.phd

Personal academic site, built with [Nuxt 3](https://nuxt.com) + [Nuxt Content](https://content.nuxt.com) + Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Site available at http://localhost:3000.

## Static build

```bash
npm run generate
```

Output written to `.output/public`. Deployed automatically to GitHub Pages on push to `main`.

## Content

All editable content lives under `content/`:

- `content/publications/`, one markdown file per paper. `type` (`journal`, `conference` or
  `national-conference`) picks the section on /publications; optional `doi`, `url`, `pdf`,
  `venueUrl`, `code` and `jcr: { quartile, impactFactor }` add links and badges.
- `content/projects/`, one markdown file per project
- `content/activities/`, one markdown file per activity (talk, conference, award, research stay…):
  `title`, `summary` (one line for the home page), `date` (`YYYY-MM-DD`, or `YYYY-MM` if the day
  doesn't matter), optional `endDate` for multi-day events, `category`, `location`, `links`
  (`[{ label, href }]`) and related `publications` (file names without `.md`). The body is the
  detailed text. Categories and their labels are in `utils/activities.ts`. `/news` redirects here.
- `content/blog/`, one markdown file per blog post

Data that isn't markdown lives under `data/`:

- `data/site.ts`, name, contact, navigation and social links
- `data/cv.ts`, the CV timeline, certifications, awards, languages and research interests
- `data/authors.ts`, ORCID iDs of co-authors, linked from author names
- `data/countries.json`, which Flickr tags become gallery filters (name and flag)

The `about` page is `pages/index.vue`; the `cv` page is `pages/cv.vue`.

## Styling

- Colors live as CSS variables in `assets/css/main.css` (light and dark theme), exposed to
  Tailwind as `ink-*`, `paper-*`, `line-*` and `accent-*` in `tailwind.config.ts`.
- Warm cream paper with slate-blue accents; light theme by default, dark theme via the header toggle.
- Serif: Cormorant Garamond. Sans: Inter. Mono: JetBrains Mono.

## Share image

`public/og.png` is rendered from `scripts/og-image.html` with headless Chrome:

```bash
npm run og:image
```
