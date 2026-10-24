/*
 * Longer FAQ hub content for /faq/. Answers are rewritten relative to the
 * homepage `faqs.ts` list so the two URLs do not publish identical Q&A text.
 * Flatten `faqHubGroups` when feeding faqPageSchema().
 */
import { EMAILS, SIGNUP_FORM_URL, mailto } from '../emails';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export type FaqHubItem = {
  q: string;
  a: string;
  inlineLink?: { phrase: string; href: string; external?: boolean };
  cta?: { href: string; label: string };
  more?: { href: string; label: string };
};

export type FaqHubGroup = {
  heading: string;
  items: FaqHubItem[];
};

export const faqHubGroups: FaqHubGroup[] = [
  {
    heading: 'Fit and basics',
    items: [
      {
        q: 'Is this the right age for my child?',
        a: 'The lab is built for ages 10 to 15 (about Grades 5 to 10), across CBSE, ICSE and state boards. Depth scales by tier inside the same 12-session main program, so younger and older students meet the same ideas at different levels.',
      },
      {
        q: 'Do they need coding experience?',
        a: 'No. Sessions start from what AI is and is not. Students build through prompts, classifiers and no-code tools. Curiosity matters more than prior programming.',
      },
      {
        q: 'What language are sessions in?',
        a: 'English only: instruction, materials and exercises.',
      },
    ],
  },
  {
    heading: 'How sessions run',
    items: [
      {
        q: 'How do parent-sponsored cohorts join?',
        a: 'Parents sponsor their children into the live online Winter Lab. The instructor teaches every live session; students can join from any city. There is no recorded video course. Practical details (device, schedule, platform) come when you enquire.',
        more: { href: `${base}/#how-it-works`, label: 'How the Winter Lab runs' },
      },
      {
        q: 'How do schools take part?',
        a: `Schools can book two free one-hour seminars on campus (teachers and students). Full labs then run on campus with the same curriculum parent-sponsored cohorts take live online, or customize as per needs after consultations. Email ${EMAILS.partner} to book now! We reply within 48 hours.`,
        inlineLink: {
          phrase: EMAILS.partner,
          href: mailto(EMAILS.partner, 'School seminar booking'),
        },
        more: { href: `${base}/#for-schools`, label: 'School seminars and labs' },
      },
      {
        q: 'Does this replace what school already teaches?',
        a: 'No. It is a companion: a short, project-dense block beside CBSE Computational Thinking & AI in Classes 3 to 8, optional Code 417 in Grades 9 and 10, and similar moves at other boards.',
        more: { href: `${base}/about/`, label: 'Mission, vision and goal' },
      },
    ],
  },
  {
    heading: 'What students build',
    items: [
      {
        q: 'What does a student finish with?',
        a: 'Working prompts, hands-on exercises, and their own checks of where a model fails, kept in a Student AI Portfolio someone else can open and verify. That record is useful for school portfolios, hackathons and later applications.',
        more: { href: `${base}/portfolio/`, label: 'See portfolio examples' },
      },
      {
        q: 'What is the Expert tier?',
        a: 'A selective eight-session stage after the main program, by invitation only. Invitees build one capstone (chatbot, image classifier, or bias audit) and present at a live online Demo Day parents join by link. It is not sold separately.',
        more: { href: `${base}/#how-it-works`, label: 'Main program and Expert tier' },
      },
    ],
  },
  {
    heading: 'How to enquire',
    items: [
      {
        q: 'How do I sign up for the Winter Lab?',
        a: `The founding live online cohort is open. Use the sign-up form; we email payment instructions to the email address you give. Questions with no obligation: ${EMAILS.learn}.`,
        inlineLink: {
          phrase: 'sign-up form',
          href: SIGNUP_FORM_URL,
          external: true,
        },
        cta: { href: mailto(EMAILS.learn, 'Winter Lab - dates and fees'), label: `Email ${EMAILS.learn}` },
        more: { href: `${base}/contact/`, label: 'All contact channels' },
      },
      {
        q: 'Who should schools and sponsors email?',
        a: `${EMAILS.partner} for seminar bookings, on-campus labs, and sponsor interest. Parents and students use ${EMAILS.learn}.`,
        cta: { href: mailto(EMAILS.partner, 'School or sponsor interest'), label: `Email ${EMAILS.partner}` },
      },
    ],
  },
];

export const faqHubFlat: FaqHubItem[] = faqHubGroups.flatMap((g) => g.items);
