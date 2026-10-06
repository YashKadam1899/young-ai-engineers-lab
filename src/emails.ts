/*
 * Purpose-specific contact addresses, one per audience, so enquiries land in
 * the right place instead of a single shared inbox.
 *
 * All four live on the youngaiengineerslab.com domain. Change an address here
 * and the mailto links, the visible text and the structured data all follow.
 */
export const EMAILS = {
  /** Parents & students: enrollment and course enquiries. */
  learn: 'learn@youngaiengineerslab.com',
  /** School and sponsor partnership enquiries. */
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
