# website

Marketing site for The Young AI Engineers Lab, a live online AI programme for
10–15 year-olds. Astro + Tailwind, static output, no backend.

## Develop

    npm install
    npm run dev

The dev server runs at http://localhost:4321/.

## Build and check

    npm run build
    npm run seo:check

The build writes static files to `dist/`. `seo:check` reads `dist/` and fails on
missing or over-long titles and descriptions, broken canonicals, a sitemap that
does not match the built pages, and claims the site must not make. It has to
pass before a push.

## Deploy

The output is static and host-agnostic. The site's address is set once, as
`site` in `astro.config.mjs`; canonicals, the sitemap and `robots.txt` all
derive from it. In the public repository a GitHub Actions workflow builds the
site and publishes it to GitHub Pages.

## Contact addresses

The addresses on the site are defined once, in `src/emails.ts`. The mailto
links, the visible text and the structured data all follow that file.
