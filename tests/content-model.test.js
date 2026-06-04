'use strict';

/**
 * The content-model contract.
 *
 * These assertions are the interface between this CMS and the Next.js front-end in
 * `jomi-challenge-frontend`. That repo's `graphql/cms/homepage.graphql` selects these
 * exact fields on these exact `__typename`s; its components read
 * `Image.data.attributes` and branch on `ImagePosition === 'Right'`.
 *
 * Renaming an attribute here is therefore a breaking change to a separate deployable,
 * and the point of this file is that such a change fails locally with a readable
 * message instead of silently rendering a blank homepage in production.
 */

const fs = require('fs');
const path = require('path');

const { BLOCKS, blockUids, block, graphqlTypes } = require('../src/lib/blocks');

const ROOT = path.join(__dirname, '..');

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));

/** `common.two-column-block` -> `src/components/common/two-column-block.json` */
const componentPath = (uid) => {
  const [category, name] = uid.split('.');
  return path.join('src', 'components', category, `${name}.json`);
};

const pascal = (value) =>
  value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const homePageSchema = readJson(
  'src/api/home-page/content-types/home-page/schema.json'
);

describe('Home Page content type', () => {
  it('is a single type, because there is exactly one homepage', () => {
    expect(homePageSchema.kind).toBe('singleType');
    expect(homePageSchema.info.singularName).toBe('home-page');
  });

  it('exposes a "sections" dynamic zone', () => {
    expect(homePageSchema.attributes.sections.type).toBe('dynamiczone');
  });

  it('accepts exactly the blocks in the registry', () => {
    expect([...homePageSchema.attributes.sections.components].sort()).toEqual(
      [...blockUids()].sort()
    );
  });

  it('keeps draft and publish on, so the seeded page has to be published', () => {
    expect(homePageSchema.options.draftAndPublish).toBe(true);
  });
});

describe.each(blockUids())('block %s', (uid) => {
  const definition = block(uid);
  const relativePath = componentPath(uid);
  const component = readJson(relativePath);

  it('has a component file on disk', () => {
    expect(fs.existsSync(path.join(ROOT, relativePath))).toBe(true);
  });

  it('derives the __typename the front-end switches on', () => {
    const [category, name] = uid.split('.');
    expect(definition.graphqlType).toBe(
      `Component${pascal(category)}${pascal(name)}`
    );
  });

  it('declares every scalar field the front-end reads', () => {
    for (const field of definition.fields) {
      expect(component.attributes[field]).toBeDefined();
    }
  });

  it('declares every media field as single media', () => {
    for (const field of definition.media) {
      expect(component.attributes[field].type).toBe('media');
      // The front-end reads `Image.data.attributes`, the single-media shape.
      // `multiple: true` would make that `Image.data[0].attributes` and break it.
      expect(component.attributes[field].multiple).toBe(false);
    }
  });

  it('declares every child attribute as a repeatable component', () => {
    for (const [attribute, childUid] of Object.entries(definition.children)) {
      expect(component.attributes[attribute].type).toBe('component');
      expect(component.attributes[attribute].repeatable).toBe(true);
      expect(component.attributes[attribute].component).toBe(childUid);
      expect(BLOCKS[childUid]).toBeDefined();
    }
  });

  it('has no attributes the registry does not know about', () => {
    const known = new Set([
      ...definition.fields,
      ...definition.media,
      ...Object.keys(definition.children),
    ]);

    expect(Object.keys(component.attributes).sort()).toEqual(
      [...known].sort()
    );
  });
});

describe('Two-Column Block image placement', () => {
  const component = readJson(componentPath('common.two-column-block'));

  it('offers exactly the two positions the front-end handles', () => {
    // TwoColumnContent.tsx flips to `row-reverse` on 'Right' and otherwise renders
    // image-left. A third value would render as left without anyone noticing.
    expect(component.attributes.ImagePosition.type).toBe('enumeration');
    expect(component.attributes.ImagePosition.enum).toEqual(['Left', 'Right']);
  });

  it('only accepts images in the image slot', () => {
    // The front-end renders this through next/image; a PDF or an MP3 uploaded here
    // would reach the browser as a broken <img>.
    expect(component.attributes.Image.allowedTypes).toEqual(['images']);
  });
});

describe('Content Page content type', () => {
  const schema = readJson(
    'src/api/content-page/content-types/content-page/schema.json'
  );

  it('addresses pages by a unique, indexed slug', () => {
    // `uid` is Strapi's slug type: unique, indexed, generated from the target field.
    expect(schema.attributes.slug.type).toBe('uid');
    expect(schema.attributes.slug.targetField).toBe('title');
    expect(schema.attributes.slug.required).toBe(true);
  });

  it('requires a title', () => {
    expect(schema.attributes.title.required).toBe(true);
  });
});

describe('GraphQL type names', () => {
  it('are unique across the registry', () => {
    const types = graphqlTypes();
    expect(new Set(types).size).toBe(types.length);
  });
});
