/*
 * Shared SEO constants and JSON-LD builders.
 *
 * SINGLE POINT OF CHANGE for the deployed origin: `site` in astro.config.mjs.
 * Nothing in this file (or in any template) hardcodes a hostname — every
 * absolute URL is derived from `Astro.site` and the configured `base`, which
 * Astro folds into `Astro.url.pathname`. Moving to a custom domain is a
 * one-line edit to `site` (plus dropping `base` if the site lands at a
 * domain root).
 *
 * Everything asserted here must be true and must already be visible on the
 * site. Deliberately absent: aggregateRating, review, Person (no instructor
 * name is published), foundingDate, numberOfStudents, and any price — all of
 * those would be fabricated, and fabricated structured data is a manual
 * action risk, not just a quality problem.
 */
import { EMAILS } from './emails';

export const SITE_NAME = 'The Young AI Engineers Lab';
/** Used for og:site_name and the <title> suffix — the short, spoken form. */
export const SITE_SHORT_NAME = 'Young AI Engineers Lab';
export const SITE_LOCALE = 'en_IN';
/** 1200x630 PNG in public/ — see README note on replacing it with a designed asset. */
export const OG_IMAGE_PATH = 'og-image.png';
export const OG_IMAGE_ALT =
  'The Young AI Engineers Lab — turning India’s 13–15 year-olds from AI consumers into AI creators';

/**
 * Resolves a path against the deployed origin, preserving Astro's configured
 * `base`. Pass paths relative to the base (no leading slash), e.g. 'about'.
 */
export function absoluteUrl(site: URL | undefined, path = ''): string {
  const origin = site ?? new URL('http://localhost/');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const suffix = path ? `${path.replace(/^\//, '')}` : '';
  return new URL(`${base}/${suffix}`, origin).href;
}

/** The brand. Emitted on every page so the entity is unambiguous site-wide. */
export function organizationSchema(site: URL | undefined) {
  const home = absoluteUrl(site);
  return {
    '@type': 'EducationalOrganization',
    '@id': `${home}#organization`,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: home,
    description:
      "An Indian programme that teaches 13–15 year-olds how AI actually works and how to build with it, as a companion to CBSE's Artificial Intelligence Skill Subject (Code 417).",
    areaServed: { '@type': 'Country', name: 'India' },
    knowsLanguage: ['en', 'hi'],
    email: EMAILS.learn,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'admissions',
        email: EMAILS.learn,
        availableLanguage: ['en', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'school and CSR partnerships',
        email: EMAILS.partner,
        availableLanguage: ['en', 'hi'],
      },
      { '@type': 'ContactPoint', contactType: 'press', email: EMAILS.press },
      { '@type': 'ContactPoint', contactType: 'investor relations', email: EMAILS.invest },
    ],
  };
}

/**
 * The programme. Every field maps to copy already on the homepage.
 * No `offers`: a price is published nowhere on the site, and an Offer without
 * a price would either be meaningless or read as free. `isAccessibleForFree:
 * false` carries the honest signal instead.
 */
export function courseSchema(site: URL | undefined) {
  const home = absoluteUrl(site);
  return {
    '@type': 'Course',
    '@id': `${home}#course`,
    name: 'The Winter Lab — AI for 13–15 year-olds',
    url: `${home}#how-it-works`,
    description:
      "A live online AI lab for students aged roughly 13 to 15. The main program runs 12 sessions over 6 weeks across three tiers — Beginner, Intermediate and Practitioner — taught in English and Hindi with regional-language material. A separate, selective 8-session Expert tier adds one capstone build and a parent-attended Demo Day. Designed as a companion to CBSE's Artificial Intelligence Skill Subject (Code 417) for Grades 9 and 10.",
    provider: { '@id': `${home}#organization` },
    inLanguage: ['en', 'hi'],
    typicalAgeRange: '13-15',
    isAccessibleForFree: false,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    teaches: [
      'Foundations: what AI is and is not, and how machine learning differs from rule-following',
      'Computational thinking: decomposition, pattern recognition and abstraction',
      'Hands-on creation: prompt engineering, image classifiers and no-code AI agents',
      'Ethics and evaluation: bias testing, spotting hallucinations and deepfake literacy',
    ],
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        name: 'Main program — Beginner, Intermediate and Practitioner tiers',
        description: '12 live sessions over 6 weeks, in three tiers of four sessions.',
        courseMode: 'Online',
      },
      {
        '@type': 'CourseInstance',
        name: 'Expert tier — capstone stage',
        description:
          'A separate 8-session stage, by invitation, built around one capstone project and a parent-attended Demo Day.',
        courseMode: 'Online',
      },
    ],
  };
}

/**
 * FAQ schema is generated from the same array the page renders, so the markup
 * cannot drift from the visible Q&A.
 */
export function faqPageSchema(faqs: ReadonlyArray<{ q: string; a: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
