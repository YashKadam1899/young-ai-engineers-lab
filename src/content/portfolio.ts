/*
 * Portfolio page content: placeholders only.
 *
 * Every entry here is an EXAMPLE of how a child's project will be shown. None
 * is a real student's work: no names, places, photos or links. Real entries
 * come from the founding cohort.
 *
 * One file feeds PhoneFrame/PortfolioCarousel (featured), PortfolioDialog
 * (examples) and PortfolioQA (the four answers per entry), so the copy and the
 * illustrations cannot drift apart.
 */

export interface Slide {
  kind: 'chat' | 'tests' | 'mistakes' | 'change';
  title: string;
  /** One sentence describing the slide for people who cannot see it. */
  alt: string;
  /**
   * For 'chat' slides each line has `from` ('student' | 'bot') and renders as
   * a bubble. For every other kind `from` is omitted and each line is a plain
   * list item (for example "Pass: ..." or "Fail: ...").
   */
  lines: { from?: 'student' | 'bot'; text: string }[];
}

export interface QA {
  q: string;
  a: string;
}

export interface PortfolioEntry {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  slides: Slide[];
  /** In the order of the four anatomy questions. */
  qa: [QA, QA, QA, QA];
}

export const anatomy: { heading: string; intro: string } = {
  heading: 'Inside every project',
  intro:
    'Every entry tells the whole story, not just the shiny part. Tap a question to see the answer.',
};

export const featured: PortfolioEntry = {
  id: 'revision-chatbot',
  title: 'Revision chatbot',
  summary: 'Answers questions on one subject and politely refuses the rest.',
  tags: ['Chatbot', 'Tested on off-topic questions'],
  slides: [
    {
      kind: 'chat',
      title: 'It answers on topic',
      alt: 'A chat where a student asks why leaves look green and the bot gives a short, correct answer.',
      lines: [
        { from: 'student', text: 'Why do leaves look green?' },
        {
          from: 'bot',
          text: 'Leaves contain chlorophyll, which reflects green light while absorbing red and blue.',
        },
        { from: 'student', text: 'What does a leaf need to make food?' },
        { from: 'bot', text: 'Sunlight, water and carbon dioxide. This is called photosynthesis.' },
      ],
    },
    {
      kind: 'chat',
      title: 'It refuses off-topic questions',
      alt: 'A chat where a student asks about a match and the bot politely says it only helps with this subject.',
      lines: [
        { from: 'student', text: 'Who won the match last night?' },
        {
          from: 'bot',
          text: 'Sorry, I only help with this subject. Want to try a question about it?',
        },
        { from: 'student', text: 'Ok. How do plants take in water?' },
        { from: 'bot', text: 'Through their roots. Tiny root hairs soak it up from the soil.' },
      ],
    },
    {
      kind: 'tests',
      title: '5 questions I tried',
      alt: 'A list of five test questions, four marked pass and one marked fail.',
      lines: [
        { text: 'Pass: Why do leaves look green?' },
        { text: 'Pass: What do plants need for photosynthesis?' },
        { text: 'Pass: Refused a question about cricket scores.' },
        { text: 'Pass: Refused when I asked it to write my homework.' },
        { text: 'Fail: Answered a question about animals, which it should have refused.' },
      ],
    },
    {
      kind: 'change',
      title: 'Next: add Class 9 topics',
      alt: 'A before and after card showing the chatbot covering Class 8 now and Class 9 topics next.',
      lines: [
        { text: 'Now: Class 8 plant science only.' },
        { text: 'Next: add Class 9 topics.' },
        { text: 'Then: run the same 5 questions again to see if anything broke.' },
      ],
    },
  ],
  qa: [
    {
      q: 'What did I make?',
      a: 'I made a chatbot that helps me revise plant science. It answers questions on that one topic and says no to everything else.',
    },
    {
      q: 'How did I try to break it?',
      a: 'I asked it tricky questions on purpose, like sports scores and "do my homework for me". Then I wrote down every answer, good or bad.',
    },
    {
      q: 'What went wrong?',
      a: 'It answered a question about animals when it should have said no. I fixed my instructions, and then I tested all my questions again to make sure I had not broken anything else.',
    },
    {
      q: 'What would I do next?',
      a: 'I want to add Class 9 topics. Then I will run the same questions again so I can show it still works.',
    },
  ],
};

export const examples: PortfolioEntry[] = [
  {
    id: 'image-sorter',
    title: 'Image sorter',
    summary: 'A classifier that tells two kinds of leaf apart, with its mistakes listed.',
    tags: ['Image classifier', 'Tested', 'Built without code'],
    slides: [
      {
        kind: 'chat',
        title: 'Teaching it two kinds of leaf',
        alt: 'A short exchange where the student describes the two leaf types and the tool confirms how many photos each has.',
        lines: [
          { from: 'student', text: 'Group 1 is healthy leaves. Group 2 is spotted leaves.' },
          { from: 'bot', text: 'Got it. 30 photos in each group. Ready to test it on new photos?' },
        ],
      },
      {
        kind: 'mistakes',
        title: 'Where it got confused',
        alt: 'A list of the sorter\'s mistakes, such as calling a spotted leaf healthy in dim light.',
        lines: [
          { text: 'A spotted leaf in dim light was called healthy.' },
          { text: 'A dusty healthy leaf was called spotted.' },
          { text: 'Score on 10 new photos: 7 right, 3 wrong.' },
        ],
      },
      {
        kind: 'change',
        title: 'Next: more light, more photos',
        alt: 'A before and after card showing the student adding photos taken in different light.',
        lines: [
          { text: 'Now: most photos taken on one desk.' },
          { text: 'Next: add photos in different light and places.' },
          { text: 'Then: test again on the same 10 new photos.' },
        ],
      },
    ],
    qa: [
      {
        q: 'What did I make?',
        a: 'I made a sorter that looks at a leaf photo and says healthy or spotted. I taught it with photos I took myself, without writing code.',
      },
      {
        q: 'How did I try to break it?',
        a: 'I tested it on 10 new photos it had never seen, in different light and with different backgrounds.',
      },
      {
        q: 'What went wrong?',
        a: 'It got 3 of the 10 wrong. Most of my training photos were on one desk, so it was partly guessing from the background.',
      },
      {
        q: 'What would I do next?',
        a: 'I would take photos in more places and light, then test on the same 10 photos again to see if the score goes up.',
      },
    ],
  },
  {
    id: 'bias-check',
    title: 'Bias check',
    summary: 'A matched-pairs test of a popular AI tool, with the evidence.',
    tags: ['Bias check', 'Tested', 'Evidence logged'],
    slides: [
      {
        kind: 'chat',
        title: 'Two prompts, one change',
        alt: 'Two near-identical prompts sent to an AI tool where only a name differs, with two slightly different replies.',
        lines: [
          { from: 'student', text: 'Write a short job reference for Aarav, a careful worker.' },
          { from: 'bot', text: 'Aarav is a dependable and detail-minded team member...' },
          { from: 'student', text: 'Write a short job reference for Meera, a careful worker.' },
          { from: 'bot', text: 'Meera is a kind and helpful team member...' },
        ],
      },
      {
        kind: 'tests',
        title: 'My 5 matched pairs',
        alt: 'A table of five matched pairs showing which ones had a clear difference and which did not.',
        lines: [
          { text: 'Pair 1: clear difference in the words used.' },
          { text: 'Pair 2: no clear difference.' },
          { text: 'Pair 3: clear difference in the words used.' },
          { text: 'Pair 4: no clear difference.' },
          { text: 'Pair 5: clear difference in the words used.' },
        ],
      },
      {
        kind: 'change',
        title: 'Next: test many more pairs',
        alt: 'A before and after card showing the student planning to test more pairs before making a claim.',
        lines: [
          { text: 'Now: 3 of 5 pairs differed. That is a hint, not proof.' },
          { text: 'Next: test at least 20 pairs.' },
          { text: 'Then: only write the claim the evidence supports.' },
        ],
      },
    ],
    qa: [
      {
        q: 'What did I make?',
        a: 'I made a fair test for an AI tool. I sent it matching prompts that changed only one thing, a name, and logged every answer.',
      },
      {
        q: 'How did I try to break it?',
        a: 'I tried to break my own test: I changed only one thing at a time and ran one pair twice to check the answers stayed steady.',
      },
      {
        q: 'What went wrong?',
        a: 'In 3 of my 5 pairs the replies differed, but 5 pairs is too few to be sure. I wrote down exactly that, instead of making a big claim.',
      },
      {
        q: 'What would I do next?',
        a: 'I would test at least 20 pairs and then say only what the numbers show.',
      },
    ],
  },
];
