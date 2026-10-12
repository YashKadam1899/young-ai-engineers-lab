#!/usr/bin/env node
/*
 * SEO gate. Run against a built dist/ before every push to the public repo
 * (the public copy's pre-push hook and the deploy workflow both call it).
 *
 *   node scripts/seo-check.mjs [dir]              live site: must be indexable
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
// A mistyped flag must not be ignored silently.
const unknown = args.filter((a) => a.startsWith('--'));
if (unknown.length) {
  console.error(`seo-check: unknown argument(s): ${unknown.join(' ')}. Use [dir].`);
  process.exit(2);
}
const dir = args[0] ?? 'dist';

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
  if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'disallows the whole site');
}
if (!siteUrl) fail('robots.txt', 'missing, or has no Sitemap: line to read the site URL from');

// 404.html is served by the host on missing URLs; it is not an indexable sitemap URL.
const allHtml = htmlFiles(dir).sort();
const pages = allHtml.filter((p) => !relative(dir, p).replace(/\\/g, '/').endsWith('404.html'));
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
  const ogUrl = one(html, /<meta property="og:url" content="([^"]*)"/);
  const ogImage = one(html, /<meta property="og:image" content="([^"]*)"/);

  // Length limits matter only where search results show the page.
  if (!title) fail(page, 'no <title>');
  else if (title.length > 60) warn(page, `title is ${title.length} chars (search results cut at ~60)`);
  if (!desc) fail(page, 'no meta description');
  else if (desc.length < 70 || desc.length > 160) fail(page, `description is ${desc.length} chars (want 70–160)`);
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

  if (robots?.includes('noindex')) fail(page, 'live page carries noindex');
  if (!ogUrl) fail(page, 'no og:url');
  if (canonical && ogUrl && ogUrl !== canonical) fail(page, `og:url ${ogUrl} differs from canonical ${canonical}`);
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

for (const [t, ps] of titles) if (ps.length > 1) fail(ps.join(', '), `share a title: ${t}`);
for (const [d, ps] of descriptions) if (ps.length > 1) fail(ps.join(', '), 'share a description');

// Sitemap must list exactly the indexable pages: nothing missing, nothing extra.
const smFiles = readdirSync(dir).filter((n) => /^sitemap-\d+\.xml$/.test(n));
if (!existsSync(join(dir, 'sitemap-index.xml')) || smFiles.length === 0) fail('sitemap', 'missing');
const listed = new Set(smFiles.flatMap((n) => [...readFileSync(join(dir, n), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])));
for (const c of canonicals) if (!listed.has(c)) fail('sitemap', `missing ${c}`);
for (const l of listed) if (!canonicals.has(l)) fail('sitemap', `lists ${l}, which is not a built page`);

// Week 1 entity / share invariants (seo-strategy-2026-10-13).
const homeHtml = readFileSync(join(dir, 'index.html'), 'utf8');
const homeTitle = decode(one(homeHtml, /<title>([^<]*)<\/title>/));
const homeOgTitle = decode(one(homeHtml, /<meta property="og:title" content="([^"]*)"/));
const homeTwTitle = decode(one(homeHtml, /<meta name="twitter:title" content="([^"]*)"/));
if (homeTitle && homeOgTitle && homeOgTitle !== homeTitle) {
  fail('/', `og:title "${homeOgTitle}" differs from <title>`);
}
if (homeTitle && homeTwTitle && homeTwTitle !== homeTitle) {
  fail('/', 'twitter:title differs from <title>');
}
const notFoundPath = join(dir, '404.html');
if (!existsSync(notFoundPath)) {
  fail('404.html', 'missing branded 404 from build');
} else {
  // Content gates only — exclude from sitemap/canonical reconciliation above.
  const html = readFileSync(notFoundPath, 'utf8');
  const title = decode(one(html, /<title>([^<]*)<\/title>/));
  const desc = decode(one(html, /<meta name="description" content="([^"]*)"/));
  if (!title) fail('404.html', 'no <title>');
  else if (title.length > 60) warn('404.html', `title is ${title.length} chars (search results cut at ~60)`);
  if (!desc) fail('404.html', 'no meta description');
  else if (desc.length < 70 || desc.length > 160) fail('404.html', `description is ${desc.length} chars (want 70–160)`);
  if (!/<html lang="[^"]+"/.test(html)) fail('404.html', 'no <html lang>');
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail('404.html', `${h1s} <h1> elements (want 1)`);
  const text = html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script(?! type="application\/ld)[\s\S]*?<\/script>/g, '');
  for (const [re, label] of BANNED) if (re.test(text)) fail('404.html', `contains ${label}`);
}

for (const file of pages) {
  const page = '/' + relative(dir, file).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let sawOrg = false;
  let sawSite = false;
  for (const m of scripts) {
    let data;
    try { data = JSON.parse(m[1]); } catch { continue; }
    const nodes = data['@graph'] ?? (Array.isArray(data) ? data : [data]);
    for (const n of nodes) {
      const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
      if (types.includes('EducationalOrganization') || types.includes('Organization')) {
        sawOrg = true;
        if (n.name !== 'Young AI Engineers Lab') {
          fail(page, `Organization name is "${n.name}", want "Young AI Engineers Lab"`);
        }
      }
      if (types.includes('WebSite')) sawSite = true;
    }
  }
  if (!sawOrg) fail(page, 'JSON-LD missing Organization / EducationalOrganization');
  if (!sawSite) fail(page, 'JSON-LD missing WebSite');
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`FAIL  ${e}`);
console.log(`seo-check (live): ${pages.length} pages, ${errors.length} failures, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
