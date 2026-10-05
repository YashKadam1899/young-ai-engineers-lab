/*
 * The site's five pages, in nav order. Shared by the header and the footer so
 * the two can never drift apart.
 *
 * `href` values are relative to Astro's configured `base` and must always be
 * joined with it (see Header.astro / Footer.astro) — hardcoding '/about' style
 * paths 404s on the GitHub Pages project-site deploy, which serves from a
 * subpath.
 *
 * Trailing slashes are deliberate: Astro builds directory-style routes, so
 * '/about/' is the canonical URL and linking to '/about' would cost a redirect
 * hop on every internal click and crawl.
 */
export const NAV_LINKS = [
  { href: '', label: 'Home' },
  { href: 'about/', label: 'About' },
  { href: 'our-team/', label: 'Our Team' },
  { href: 'contact/', label: 'Contact Us' },
  { href: 'for-investors/', label: 'For Investors' },
] as const;
