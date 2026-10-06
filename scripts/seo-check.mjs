#!/usr/bin/env node
/*
 * SEO gate. Run against a built dist/ before every push to the public repo
 * (the public copy's pre-push hook and the deploy workflow both call it).
 *
 *   node scripts/seo-check.mjs [dir]              live site: must be indexable
 *   node scripts/seo-check.mjs [dir] --archive    frozen /v1/: must be noindex,
 *                                                 canonical pointing out of it
 *
 * The site's own URL is read from the Sitemap: line of dir/robots.txt, so the
 * script works for any `site` + `base` without being told them.
 *
 * Exits 1 on any failure. Warnings print but do not fail. A clean run covers
 * the mechanical checks only; wording, claims and share-card artwork still
 * need a human read before a push.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const archive = args.includes('--archive');
const dir = args.find((a) => !a.startsWith('--')) ?? 'dist';

const errors = [];
const warnings = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

// Claims found false or unsourced, which must not come back. Whole words,
// case-insensitive, matched against page text.
const BANNED = [
  [/250\s?M\+/i, 'unsourced 250M+ figure'],
  [/(<|&lt;)\s?5\s?%/i, 'unsourced <5% figure'],
  [/₹\s?5,000/i, 'unsourced ₹5,000–₹15,000 pricing'],
  [/\bmandat(e|ed|es|ing|ory|orily)\b/i, '"mandate"/"mandatory" (Code 417 is optional)'],
  [/\bAntler\b/i, 'Antler reference'],
  [/\bBhashini\b/i, 'Bhashini claim (teaching is English-only)'],
];

function htmlFiles(d) {
  return readdirSync(d).flatMap((name) => {
    const p = join(d, name);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

const one = (html, re) => html.match(re)?.[1];
const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

if (!existsSync(join(dir, 'index.html'))) {
  console.error(`seo-check: no ${dir}/index.html — build first.`);
  process.exit(1);
}

let siteUrl;
const robotsPath = join(dir, 'robots.txt');
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  siteUrl = one(robots, /^Sitemap:\s*(\S+)sitemap-index\.xml\s*$/m);
  if (!archive && /^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'disallows the whole site');
}
if (!archive && !siteUrl) fail('robots.txt', 'missing, or has no Sitemap: line to read the site URL from');

const pages = htmlFiles(dir).sort();
const titles = new Map();
const descriptions = new Map();
const canonicals = new Set();

for (const file of pages) {
  const page = '/' + relative(dir, file).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');

  const title = decode(one(html, /<title>([^<]*)<\/title>/));
  const desc = decode(one(html, /<meta name="description" content="([^"]*)"/));
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = one(html, /<meta name="robots" content="([^"]*)"/);
  const ogImage = one(html, /<meta property="og:image" content="([^"]*)"/);

  // Length limits matter only where search results show the page.
  if (!title) fail(page, 'no <title>');
  else if (!archive && title.length > 60) warn(page, `title is ${title.length} chars (search results cut at ~60)`);
  if (!desc) fail(page, 'no meta description');
  else if (!archive && (desc.length < 70 || desc.length > 160)) fail(page, `description is ${desc.length} chars (want 70–160)`);
  if (!canonical) fail(page, 'no canonical link');
  if (!/<html lang="[^"]+"/.test(html)) fail(page, 'no <html lang>');
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(page, `${h1s} <h1> elements (want 1)`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt=/.test(img)) fail(page, `<img> without alt: ${img.slice(0, 80)}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(page, 'JSON-LD does not parse'); }
  }

  // Visible text plus attribute values, so claims tucked into alt text or meta tags count.
  const text = html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script(?! type="application\/ld)[\s\S]*?<\/script>/g, '');
  for (const [re, label] of BANNED) if (re.test(text)) fail(page, `contains ${label}`);

  if (archive) {
    if (!robots?.includes('noindex')) fail(page, 'archive page is indexable (no noindex)');
    if (canonical && /\/v1\//.test(canonical)) fail(page, `archive canonical points at itself: ${canonical}`);
    continue;
  }

  if (robots?.includes('noindex')) fail(page, 'live page carries noindex');
  if (siteUrl && canonical) {
    const expected = new URL(page.slice(1), siteUrl).href;
    if (canonical !== expected) fail(page, `canonical ${canonical}, expected ${expected}`);
  }
  if (siteUrl && ogImage) {
    const local = ogImage.startsWith(siteUrl) ? join(dir, ogImage.slice(siteUrl.length)) : null;
    if (!local || !existsSync(local)) fail(page, `og:image not in the build: ${ogImage}`);
  } else if (!ogImage) fail(page, 'no og:image');

  if (title) titles.set(title, [...(titles.get(title) ?? []), page]);
  if (desc) descriptions.set(desc, [...(descriptions.get(desc) ?? []), page]);
  if (canonical) canonicals.add(canonical);
}

if (!archive) {
  for (const [t, ps] of titles) if (ps.length > 1) fail(ps.join(', '), `share a title: ${t}`);
  for (const [d, ps] of descriptions) if (ps.length > 1) fail(ps.join(', '), 'share a description');

  // Sitemap must list exactly the indexable pages: nothing missing, nothing extra.
  const smFiles = readdirSync(dir).filter((n) => /^sitemap-\d+\.xml$/.test(n));
  if (!existsSync(join(dir, 'sitemap-index.xml')) || smFiles.length === 0) fail('sitemap', 'missing');
  const listed = new Set(smFiles.flatMap((n) => [...readFileSync(join(dir, n), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])));
  for (const c of canonicals) if (!listed.has(c)) fail('sitemap', `missing ${c}`);
  for (const l of listed) if (!canonicals.has(l)) fail('sitemap', `lists ${l}, which is not a built page`);
  if ([...listed].some((l) => /\/v1\//.test(l))) fail('sitemap', 'lists /v1/ archive pages');
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`FAIL  ${e}`);
console.log(`seo-check (${archive ? 'archive' : 'live'}): ${pages.length} pages, ${errors.length} failures, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
