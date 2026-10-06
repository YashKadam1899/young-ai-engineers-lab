// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Custom domain, served from the root of GitHub Pages (repo Settings > Pages
  // > Custom domain). The www host is the main address: the apex
  // youngaiengineerslab.com (DNS A records) and the old github.io address both
  // redirect to it, which GitHub Pages does itself. SINGLE POINT OF CHANGE for the deployed origin:
  // canonicals, og:url, the sitemap and robots.txt are all derived from `site`
  // (and `base`, which is the default '/'), and no template hardcodes either.
  // Host lowercased deliberately, so canonical URLs match byte for byte.
  site: 'https://www.youngaiengineerslab.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
