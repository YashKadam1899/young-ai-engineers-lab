// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Custom domain, served from the root of GitHub Pages (repo Settings > Pages
  // > Custom domain). SINGLE POINT OF CHANGE for the deployed origin:
  // canonicals, og:url, the sitemap and robots.txt are all derived from `site`
  // (and `base`, which is now the default '/'), and no template hardcodes
  // either. The deploy workflow and the pre-push hook read `site` from here to
  // build the /v1/ archive against the same origin. Host lowercased
  // deliberately, so canonical URLs match byte for byte.
  site: 'https://youngaiengineerslab.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
