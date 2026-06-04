'use strict';

/**
 * The seed content, as data.
 *
 * This module is pure: it takes an image resolver and returns plain objects. It never
 * touches Strapi, a database or the filesystem, which is what lets the test suite
 * assert the challenge's acceptance criteria directly (see `tests/seed-content.test.js`).
 *
 * The Home Page composition is not arbitrary — it is the deliverable the challenge
 * brief asks for:
 *
 *   - 2 Two-Column Blocks
 *   - 1 Header Block
 *   - 1 Carousel Block
 *
 * Keeping it here rather than only in a database means the deliverable is reviewable
 * in a diff and reproducible on a fresh checkout.
 */

const { BLOCKS } = require('../lib/blocks');

/**
 * Images the seeder uploads before composing the page. `file` is resolved relative to
 * `src/seed/assets`.
 */
const SEED_IMAGES = [
  {
    key: 'operating-room',
    file: 'operating-room.png',
    name: 'operating-room.png',
    alternativeText: 'Surgeons operating under theatre lights',
    caption: 'Every procedure is filmed from the surgeon’s point of view.',
  },
  {
    key: 'peer-review',
    file: 'peer-review.png',
    name: 'peer-review.png',
    alternativeText: 'A reviewer annotating a surgical video timeline',
    caption: 'Each article is peer reviewed before publication.',
  },
  {
    key: 'laparoscopy',
    file: 'laparoscopy.png',
    name: 'laparoscopy.png',
    alternativeText: 'Laparoscopic instruments inside the abdominal cavity',
    caption: 'Laparoscopic cholecystectomy, step by step.',
  },
  {
    key: 'orthopedics',
    file: 'orthopedics.png',
    name: 'orthopedics.png',
    alternativeText: 'An orthopaedic surgeon preparing a knee arthroscopy',
    caption: 'Knee arthroscopy with portal placement annotated.',
  },
  {
    key: 'teaching',
    file: 'teaching.png',
    name: 'teaching.png',
    alternativeText: 'Residents reviewing an operation on a wall display',
    caption: 'Residents prepare for theatre by watching the case first.',
  },
];

/**
 * Compose the Home Page dynamic zone.
 *
 * @param {(key: string) => (number|null)} imageId resolves a seed image key to the id
 *        of the uploaded media file. Returning null is fine — every block renders
 *        without its image — which keeps the seeder usable when uploads are disabled.
 * @returns {Array<Object>} dynamic-zone entries, each tagged with `__component`.
 */
const buildHomePageSections = (imageId = () => null) => [
  {
    __component: 'common.header',
    Text: 'Surgical video, peer reviewed.',
    ButtonText: 'Browse the library',
    ButtonLink: '/library',
  },
  {
    __component: 'common.two-column-block',
    TitleText: 'Filmed in theatre, narrated by the operating surgeon',
    Description:
      'Every article on JOMI is a full-length operation recorded from the surgeon’s ' +
      'point of view, with the surgeon narrating the decisions as they are made — ' +
      'why this plane, why this instrument, what to do when the anatomy is not what ' +
      'the textbook promised.',
    ButtonText: 'Watch a sample operation',
    ButtonUrl: '/library/laparoscopic-cholecystectomy',
    ImagePosition: 'Right',
    Image: imageId('operating-room'),
  },
  {
    __component: 'common.two-column-block',
    TitleText: 'Reviewed by surgeons before it is published',
    Description:
      'Each submission is reviewed by practising surgeons in the same speciality. ' +
      'Reviewers annotate the video itself rather than a manuscript about it, so the ' +
      'critique lands on the step it refers to and readers can see exactly what was ' +
      'questioned.',
    ButtonText: 'How peer review works',
    ButtonUrl: '/about/peer-review',
    ImagePosition: 'Left',
    Image: imageId('peer-review'),
  },
  {
    __component: 'common.carousel',
    Item: [
      {
        TitleText: 'Laparoscopic cholecystectomy',
        Description:
          'Critical view of safety demonstrated in full, including the dissection ' +
          'that establishes it and the point at which the surgeon would convert.',
        ButtonText: 'Open the article',
        ButtonUrl: '/library/laparoscopic-cholecystectomy',
        ImagePosition: 'Left',
        Image: imageId('laparoscopy'),
      },
      {
        TitleText: 'Knee arthroscopy with meniscal repair',
        Description:
          'Portal placement, diagnostic sweep and an inside-out repair, with the ' +
          'surgeon explaining when a tear is worth repairing rather than trimming.',
        ButtonText: 'Open the article',
        ButtonUrl: '/library/knee-arthroscopy',
        ImagePosition: 'Right',
        Image: imageId('orthopedics'),
      },
      {
        TitleText: 'Teaching files for residents',
        Description:
          'Programmes use JOMI to prepare residents for cases they are about to ' +
          'scrub on: watch the operation, read the review, then step into theatre.',
        ButtonText: 'For institutions',
        ButtonUrl: '/institutions',
        ImagePosition: 'Left',
        Image: imageId('teaching'),
      },
    ],
  },
];

/** Content Pages seeded so the collection type is not empty on first boot. */
const CONTENT_PAGES = [
  {
    slug: 'about',
    title: 'About JOMI',
    content:
      '## About\n\nJOMI is a peer-reviewed journal of surgical video. Articles are ' +
      'full-length operations, filmed in theatre and narrated by the operating ' +
      'surgeon.\n',
  },
  {
    slug: 'peer-review',
    title: 'How peer review works',
    content:
      '## Peer review\n\nReviewers annotate the video timeline directly. A submission ' +
      'is published once two reviewers in the same speciality sign off.\n',
  },
  {
    slug: 'institutions',
    title: 'For institutions',
    content:
      '## For institutions\n\nInstitutional subscriptions cover every resident and ' +
      'attending on a single sign-on, with usage reporting by department.\n',
  },
];

/**
 * The acceptance criteria from the challenge brief, expressed as data so both the
 * seeder and the test suite check the same numbers.
 */
const REQUIRED_SECTION_COUNTS = {
  'common.two-column-block': 2,
  'common.header': 1,
  'common.carousel': 1,
};

/**
 * Count the dynamic-zone entries by component UID.
 *
 * @param {Array<{__component: string}>} sections
 * @returns {Object<string, number>}
 */
const countSections = (sections) =>
  sections.reduce((counts, section) => {
    counts[section.__component] = (counts[section.__component] || 0) + 1;
    return counts;
  }, {});

/**
 * Check a composed page against the brief. Returned rather than thrown so the seeder
 * can log every problem at once instead of stopping at the first.
 *
 * @param {Array<{__component: string}>} sections
 * @returns {string[]} human-readable problems; empty means the page satisfies the brief.
 */
const validateHomePageSections = (sections) => {
  const problems = [];
  const counts = countSections(sections);

  for (const [uid, expected] of Object.entries(REQUIRED_SECTION_COUNTS)) {
    const actual = counts[uid] || 0;
    if (actual !== expected) {
      problems.push(
        `expected ${expected} × "${uid}" in sections, found ${actual}`
      );
    }
  }

  for (const uid of Object.keys(counts)) {
    if (!BLOCKS[uid]) {
      problems.push(`"${uid}" is not a registered content block`);
    }
  }

  return problems;
};

module.exports = {
  SEED_IMAGES,
  CONTENT_PAGES,
  REQUIRED_SECTION_COUNTS,
  buildHomePageSections,
  countSections,
  validateHomePageSections,
};
