// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // GitHub Pages project-site specifics — this copy is dedicated to Pages
  // deployment, so it's fine for these to be hardcoded here even though the
  // canonical source in the tutor monorepo stays host-agnostic.
  site: 'https://YashKadam1899.github.io',
  base: '/young-ai-engineers-lab',
  vite: {
    plugins: [tailwindcss()]
  }
});