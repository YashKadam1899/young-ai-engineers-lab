/*
 * Parent nav vs footer: header and hamburger use NAV_LINKS only. Footer uses
 * FOOTER_LINKS (those links plus For Investors), so investors stay reachable
 * without sitting in the parent-facing main nav.
 *
 * `href` values are relative to Astro's configured `base` and must always be
 * joined with it (see Header.astro / Footer.astro) - hardcoding '/about' style
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
  { href: 'portfolio/', label: 'Portfolio' },
  { href: 'contact/', label: 'Contact Us' },
] as const;

export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { href: 'faq/', label: 'FAQ' },
  { href: 'for-investors/', label: 'For Investors' },
] as const;
