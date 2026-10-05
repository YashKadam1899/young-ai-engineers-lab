/*
 * Purpose-specific contact addresses, one per audience, so enquiries land in
 * the right place instead of a single shared inbox.
 *
 * NOTE: these are the intended addresses on the youngaiengineerslab.com
 * domain, but the mailboxes are not confirmed live yet — each one must be
 * created and monitored before this site is promoted anywhere. Keep that
 * caveat here in code only; it must never appear in user-visible copy.
 */
export const EMAILS = {
  /** Parents & students: enrollment and course enquiries. */
  learn: 'learn@youngaiengineerslab.com',
  /** Schools, and CSR / state partnership enquiries (one address serves both). */
  partner: 'partner@youngaiengineerslab.com',
  /** Press & media. */
  press: 'meet@youngaiengineerslab.com',
  /** Investors: full-deck requests. */
  invest: 'invest@youngaiengineerslab.com',
} as const;

/** Builds a mailto: link with a pre-filled subject line. */
export function mailto(address: string, subject: string): string {
  return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
}
