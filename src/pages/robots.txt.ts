/*
 * robots.txt.
 *
 * Generated as a route rather than dropped in public/ so the Sitemap: line is
 * always derived from `site` in astro.config.mjs — the deploy copy and this
 * host-agnostic copy therefore stay correct without either one hardcoding the
 * other's hostname. Output path is identical to a public/robots.txt
 * (dist/robots.txt).
 *
 * IMPORTANT (GitHub Pages project site): crawlers only read robots.txt from a
 * domain root. While this site is served from
 * https://yashkadam1899.github.io/young-ai-engineers-lab/, this file is served
 * at .../young-ai-engineers-lab/robots.txt and is silently IGNORED — the
 * effective robots.txt is the one in the separate yashkadam1899.github.io
 * user-pages repo. Until a custom domain exists, submit the sitemap directly
 * in Google Search Console. On a custom domain this file becomes live and
 * correct with no changes.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemapUrl = site ? new URL(`${base}/sitemap-index.xml`, site).href : undefined;

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...(sitemapUrl ? [`Sitemap: ${sitemapUrl}`, ''] : []),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
