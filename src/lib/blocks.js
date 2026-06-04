'use strict';

/**
 * The content-block registry.
 *
 * `sections` on the Home Page is a Strapi dynamic zone: an editor-ordered list of
 * heterogeneous components. Three places need to agree about what may appear in it —
 * the populate tree used when reading it, the seeder that writes it, and the tests
 * that guard the contract the Next.js front-end depends on.
 *
 * Rather than repeating that knowledge three times, it is declared once here. Adding a
 * new block to the dynamic zone is: create the component JSON, add it to the
 * `components` array in the Home Page schema, and add one entry below. Nothing else
 * has to change — the populate tree and the contract tests derive themselves from this
 * object.
 */

/**
 * @typedef {Object} BlockDefinition
 * @property {string} graphqlType  The `__typename` the GraphQL API exposes. The
 *                                 front-end switches on this value.
 * @property {string[]} fields     Scalar attributes the front-end reads.
 * @property {string[]} media      Media attributes that must be populated.
 * @property {Object<string,string>} children Repeatable component attributes, mapped
 *                                 to the UID of the component they contain.
 */

/** @type {Object<string, BlockDefinition>} */
const BLOCKS = {
  'common.header': {
    graphqlType: 'ComponentCommonHeader',
    fields: ['Text', 'ButtonText', 'ButtonLink'],
    media: [],
    children: {},
  },
  'common.two-column-block': {
    graphqlType: 'ComponentCommonTwoColumnBlock',
    fields: [
      'TitleText',
      'Description',
      'ButtonText',
      'ButtonUrl',
      'ImagePosition',
    ],
    media: ['Image'],
    children: {},
  },
  'common.carousel': {
    graphqlType: 'ComponentCommonCarousel',
    fields: [],
    media: [],
    children: { Item: 'common.two-column-block' },
  },
};

/** UID of the dynamic zone's owning content type. */
const HOME_PAGE_UID = 'api::home-page.home-page';

/** Name of the dynamic-zone attribute on the Home Page. */
const SECTIONS_ATTRIBUTE = 'sections';

/** @returns {string[]} every component UID the dynamic zone accepts. */
const blockUids = () => Object.keys(BLOCKS);

/**
 * @param {string} uid component UID, e.g. `common.header`
 * @returns {BlockDefinition}
 */
const block = (uid) => {
  const definition = BLOCKS[uid];
  if (!definition) {
    throw new Error(
      `Unknown content block "${uid}". Register it in src/lib/blocks.js.`
    );
  }
  return definition;
};

/** @returns {string[]} the `__typename` values the front-end may receive. */
const graphqlTypes = () => blockUids().map((uid) => BLOCKS[uid].graphqlType);

module.exports = {
  BLOCKS,
  HOME_PAGE_UID,
  SECTIONS_ATTRIBUTE,
  blockUids,
  block,
  graphqlTypes,
};
