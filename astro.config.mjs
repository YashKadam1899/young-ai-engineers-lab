// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // GitHub Pages project-site specifics — this copy is dedicated to Pages
  // deployment, so it's fine for these to be hardcoded here even though the
  // canonical source in the tutor monorepo stays host-agnostic.
  //
  // SINGLE POINT OF CHANGE for the deployed origin: canonicals, og:url, the
  // sitemap and robots.txt are all derived from `site` + `base`, and no
  // template hardcodes either. Moving to a custom domain is: set `site` to the
  // new origin and delete `base`. Host lowercased deliberately — GitHub Pages
  // serves the lowercase hostname, and canonical URLs should match byte for
  // byte. NEVER copy this file to/from the monorepo copy.
  site: 'https://yashkadam1899.github.io',
  base: '/young-ai-engineers-lab',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
