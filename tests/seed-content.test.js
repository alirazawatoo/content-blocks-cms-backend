'use strict';

/**
 * The challenge's backend acceptance criteria, as executable assertions.
 *
 * The brief asks for a Home Page built from 2 Two-Column Blocks, 1 Header Block and a
 * Carousel Block. Because that deliverable is content rather than code it would
 * normally live only in a developer's SQLite file, where nobody can review it and a
 * fresh clone does not have it. Here it is a committed, seeded, tested artefact.
 */

const fs = require('fs');
const path = require('path');

const { BLOCKS, blockUids } = require('../src/lib/blocks');
const {
  SEED_IMAGES,
  CONTENT_PAGES,
  REQUIRED_SECTION_COUNTS,
  buildHomePageSections,
  countSections,
  validateHomePageSections,
} = require('../src/seed/content');

const imageId = (key) => SEED_IMAGES.findIndex((image) => image.key === key) + 1;
const sections = buildHomePageSections(imageId);

describe('the Home Page the brief asks for', () => {
  it('contains 2 Two-Column Blocks, 1 Header Block and 1 Carousel Block', () => {
    expect(countSections(sections)).toMatchObject(REQUIRED_SECTION_COUNTS);
  });

  it('passes its own validator', () => {
    expect(validateHomePageSections(sections)).toEqual([]);
  });

  it('only uses registered blocks', () => {
    for (const section of sections) {
      expect(blockUids()).toContain(section.__component);
    }
  });

  it('leads with the header block', () => {
    expect(sections[0].__component).toBe('common.header');
  });
});

describe('validateHomePageSections', () => {
  it('reports a missing block', () => {
    const short = sections.filter((s) => s.__component !== 'common.carousel');

    expect(validateHomePageSections(short)).toContain(
      'expected 1 × "common.carousel" in sections, found 0'
    );
  });

  it('reports an unregistered block', () => {
    const problems = validateHomePageSections([
      ...sections,
      { __component: 'common.made-up' },
    ]);

    expect(problems).toContain('"common.made-up" is not a registered content block');
  });
});

describe('every seeded block', () => {
  const flat = sections.flatMap((section) =>
    section.__component === 'common.carousel'
      ? [
        section,
        ...section.Item.map((item) => ({
          ...item,
          __component: 'common.two-column-block',
        })),
      ]
      : [section]
  );

  it('fills in every field its block declares', () => {
    for (const entry of flat) {
      for (const field of BLOCKS[entry.__component].fields) {
        expect(entry[field]).toBeTruthy();
      }
    }
  });

  it('uses an image position the front-end understands', () => {
    const positions = flat
      .filter((entry) => entry.ImagePosition !== undefined)
      .map((entry) => entry.ImagePosition);

    expect(positions.length).toBeGreaterThan(0);
    for (const position of positions) {
      expect(['Left', 'Right']).toContain(position);
    }
  });

  it('only links to URLs the front-end will render', () => {
    // lib/safeHref.ts in the front-end drops anything that is not http(s), mailto,
    // tel or relative — a seeded link it rejects renders without its button.
    const urls = flat
      .flatMap((entry) => [entry.ButtonUrl, entry.ButtonLink])
      .filter(Boolean);

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).toMatch(/^(\/|https?:\/\/|mailto:|tel:)/);
    }
  });

  it('references an image that the seeder actually uploads', () => {
    const withImages = flat.filter((entry) => 'Image' in entry);

    expect(withImages.length).toBe(5);
    for (const entry of withImages) {
      expect(entry.Image).toBeGreaterThan(0);
    }
  });
});

describe('the carousel', () => {
  const carousel = sections.find((s) => s.__component === 'common.carousel');

  it('holds several items', () => {
    expect(carousel.Item.length).toBeGreaterThanOrEqual(3);
  });

  it('holds items shaped like Two-Column Blocks', () => {
    // CarouselBlock.tsx renders each slide through TwoColumnContent.
    for (const item of carousel.Item) {
      expect(item).toHaveProperty('TitleText');
      expect(item).toHaveProperty('Description');
      expect(item).toHaveProperty('Image');
    }
  });
});

describe('seed images', () => {
  it('are all present on disk', () => {
    for (const image of SEED_IMAGES) {
      const file = path.join(__dirname, '..', 'src', 'seed', 'assets', image.file);
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  it('carry alt text, because the front-end falls back to the block title', () => {
    for (const image of SEED_IMAGES) {
      expect(image.alternativeText.length).toBeGreaterThan(0);
    }
  });

  it('have unique keys', () => {
    const keys = SEED_IMAGES.map((image) => image.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('seeded content pages', () => {
  it('have unique slugs, which the content type now enforces', () => {
    const slugs = CONTENT_PAGES.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('are slug-shaped', () => {
    for (const page of CONTENT_PAGES) {
      expect(page.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(page.title).toBeTruthy();
    }
  });
});

describe('buildHomePageSections without images', () => {
  it('still composes a valid page', () => {
    // Uploads can be disabled or fail; the page must survive it.
    const withoutImages = buildHomePageSections();

    expect(validateHomePageSections(withoutImages)).toEqual([]);
    expect(withoutImages[1].Image).toBeNull();
  });
});
