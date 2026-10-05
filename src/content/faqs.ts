/*
 * The homepage FAQ, in render order.
 *
 * Deliberately shared: `src/pages/index.astro` feeds this exact array to
 * `faqPageSchema()` for the FAQPage JSON-LD, and `HomeFaq.astro` renders the
 * same array as the visible <details> list. Keeping one source means the
 * structured data can never drift from the copy on the page — a mismatch is a
 * Google structured-data violation, not just a tidiness problem. Never
 * duplicate this array; import it in both places.
 *
 * `href` values follow the same base-joining rule as nav.ts / Header.astro:
 * relative to Astro's configured `base`, joined with exactly one '/'.
 */
import { EMAILS, mailto } from '../emails';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const faqs = [
  {
    q: 'Who is this for?',
    a: "Students aged 10 to 15 — roughly Grades 5 to 10, across CBSE, ICSE and state boards. The three tiers of the main program scale with age, so a 10-year-old and a 15-year-old meet the same ideas at different depths rather than sitting through the same material. It's the range where AI tools are already part of daily life, and where schools are starting to teach AI inside regular subjects.",
  },
  {
    q: 'Does my child need to know how to code?',
    a: 'No prior coding required. We start from what AI is and what it is not, and the building happens through prompts, image classifiers and no-code tools. Curiosity matters more here than any head start in programming.',
  },
  {
    q: 'What language is it taught in?',
    a: 'English. All sessions, materials and exercises are in English.',
  },
  {
    q: 'Why now?',
    a: "Government policy, the new CBSE syllabus, and growing parent concern are all lining up in the same two years. The clearest signal: from session 2026-27, Computational Thinking & AI is an integrated part of CBSE's curriculum for Classes 3 to 8 — taught inside subjects every student already takes, rather than offered as a choice. Meanwhile students already have AI in their pocket, and most teachers have had no hands-on, project-based training to work with.",
    more: { href: `${base}/about/`, label: 'Read our mission, vision and goal' },
  },
  {
    q: 'How does this relate to what school already teaches? Does it replace it?',
    a: "It supplements school — it replaces nothing. For CBSE schools specifically: Computational Thinking & AI is integrated into Classes 3 to 8 for every student, and Artificial Intelligence (Code 417) is an optional but substantial Skill Subject in Grades 9 and 10. Other boards are moving in the same direction at their own pace. We're designed as a lab companion either way: a short, project-dense block that gives students reps on building and questioning AI systems.",
  },
  {
    q: 'What is the Student AI Portfolio, and why does it matter?',
    a: "It's a public, verifiable record of what your child actually built, rather than a private folder of files. Some school syllabi already ask students to keep a portfolio of their AI activities — CBSE's Code 417 does, for Grades 9 and 10. Ours is built to be opened and checked by someone else: the kind of evidence that holds up on a college or hackathon application.",
  },
  {
    q: 'What will my child actually build?',
    a: 'Modules end in something real rather than a quiz — working prompts, hands-on exercises with AI tools, and their own tests of where a model breaks down. Students later invited into the selective Expert tier go on to build one full capstone — a chatbot, an image classifier, or a bias audit — and present it at a parent-attended Demo Day. That invitation comes from inside the main program, so there is nothing separate to sign up for.',
    more: { href: `${base}/#how-it-works`, label: 'See how the two stages run' },
  },
  {
    q: 'What does it cost, and when does the next cohort start?',
    a: 'The founding Winter Lab cohort is open now. Email us and we will send you the current dates and fees, with no obligation.',
    cta: { href: mailto(EMAILS.learn, 'Winter Lab — dates and fees'), label: `Email ${EMAILS.learn}` },
  },
  {
    q: 'How do schools bring this to their students?',
    a: "We work as a delivery partner to schools across CBSE, ICSE and state boards — curriculum packs, teacher enablement, and a moderated student sandbox that fit into a school's existing computer lab or Atal Tinkering Lab. Funded implementations for government and rural schools are possible through CSR and state partnerships.",
    cta: { href: mailto(EMAILS.partner, 'School partnership enquiry'), label: `Email ${EMAILS.partner}` },
  },
];
