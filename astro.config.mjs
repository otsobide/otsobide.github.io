// @ts-check
import { defineConfig } from 'astro/config';

// Deployed on GitHub Pages at https://javierparada.phd. SITE_URL / BASE_PATH can override
// these (e.g. for a preview on another domain or a subpath).
const site = process.env.SITE_URL ?? 'https://javierparada.phd';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  redirects: {
    // Redirect targets are not prefixed with `base` automatically.
    '/news': `${base.replace(/\/$/, '')}/activities`,
  },
});
