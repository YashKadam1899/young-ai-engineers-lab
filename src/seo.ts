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
 * site. Deliberately absent: aggregateRating, review, foundingDate,
 * numberOfStudents, and any price — all of those would be fabricated, and
 * fabricated structured data is a manual action risk, not just a quality
 * problem.
 *
 * `founder` (Person) IS included: both names and their LinkedIn profiles are
 * published on /our-team/, so it asserts nothing the site does not show.
 */
import { EMAILS } from './emails';

export const SITE_NAME = 'The Young AI Engineers Lab';
/** Used for og:site_name and the <title> suffix — the short, spoken form. */
export const SITE_SHORT_NAME = 'Young AI Engineers Lab';
export const SITE_LOCALE = 'en_IN';
/** 1200x630 PNG in public/ — see README note on replacing it with a designed asset. */
export const OG_IMAGE_PATH = 'og-image.png';
export const OG_IMAGE_ALT =
  'The Young AI Engineers Lab — turning India’s 10–15 year-olds from AI consumers into AI developers';

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
      "An Indian programme that teaches 10–15 year-olds how AI actually works and how to build with it, alongside what schools across CBSE, ICSE and state boards are now starting to teach about AI. Taught in English.",
    areaServed: { '@type': 'Country', name: 'India' },
    knowsLanguage: ['en'],
    // Mirrors the two founders shown on /our-team/, including the LinkedIn
    // profiles published there. sameAs is how a search engine ties the person
    // to an identity it already knows.
    founder: [
      {
        '@type': 'Person',
        name: 'Balaji Bhat',
        jobTitle: 'Founder & CEO',
        sameAs: 'https://www.linkedin.com/in/balaji-b-9a63731a4/',
      },
      {
        '@type': 'Person',
        name: 'Yash Kadam',
        jobTitle: 'Co-Founder & Head of Curriculum',
        sameAs: 'https://www.linkedin.com/in/yashkadam1899/',
      },
    ],
    email: EMAILS.learn,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'admissions',
        email: EMAILS.learn,
        availableLanguage: ['en'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'school and CSR partnerships',
        email: EMAILS.partner,
        availableLanguage: ['en'],
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
    name: 'The Winter Lab — AI for 10–15 year-olds',
    url: `${home}#how-it-works`,
    description:
      "A live online AI lab for students aged roughly 10 to 15, with depth scaling by tier. The main program runs 12 sessions over 6 weeks across three tiers — Beginner, Intermediate and Practitioner — taught in English. A separate, selective 8-session Expert tier is offered by invitation to students from the main program, and is not separately registrable. Designed as a companion to the AI curriculum Indian schools are now introducing, across CBSE, ICSE and state boards.",
    provider: { '@id': `${home}#organization` },
    inLanguage: ['en'],
    typicalAgeRange: '10-15',
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
        description:
          '12 live sessions over 6 weeks, in three tiers of four sessions. This is the stage students enrol in.',
        courseMode: 'Online',
      },
      {
        '@type': 'CourseInstance',
        name: 'Expert tier — capstone stage',
        description:
          'A separate 8-session stage built around one capstone project and a parent-attended Demo Day. Offered by invitation to students from the main program; it cannot be registered for directly.',
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
