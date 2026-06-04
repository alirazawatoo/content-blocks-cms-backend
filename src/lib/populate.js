'use strict';

/**
 * Populate helpers for the Home Page dynamic zone.
 *
 * Strapi does not populate relations, media or dynamic zones unless the caller asks.
 * That default is right for a generic API and wrong for this one: the Home Page exists
 * only to be rendered, and a response without its `sections` is useless to every
 * consumer. `GET /api/home-page` therefore applies the tree below by default.
 *
 * The tree is derived from the block registry so it cannot drift from the content
 * model. These functions are pure — no Strapi import — which is what makes the
 * controller testable without booting the CMS.
 */

const { BLOCKS, SECTIONS_ATTRIBUTE } = require('./blocks');

/**
 * Build the populate tree for one dynamic zone from the block registry.
 *
 * Strapi 4.1 applies a single populate object across every component in a dynamic
 * zone and ignores keys a given component does not have, so the union of all blocks'
 * media and child attributes is the correct — and only expressible — shape.
 *
 * @returns {Object} e.g. `{ sections: { populate: { Image: true, Item: { populate: { Image: true } } } } }`
 */
const buildSectionsPopulate = () => {
  const inner = {};

  for (const definition of Object.values(BLOCKS)) {
    for (const mediaField of definition.media) {
      inner[mediaField] = true;
    }

    for (const [attribute, childUid] of Object.entries(definition.children)) {
      const child = BLOCKS[childUid];
      if (!child) {
        throw new Error(
          `Block "${attribute}" references unregistered component "${childUid}".`
        );
      }
      const childPopulate = {};
      for (const mediaField of child.media) {
        childPopulate[mediaField] = true;
      }
      inner[attribute] =
        Object.keys(childPopulate).length > 0
          ? { populate: childPopulate }
          : true;
    }
  }

  return { [SECTIONS_ATTRIBUTE]: { populate: inner } };
};

/**
 * Coerce the string booleans a query string produces into real ones.
 *
 * `?populate[sections]=true` arrives as `{ sections: 'true' }`. Strapi 4.1's
 * `convertNestedPopulate` accepts a boolean or an object and throws on anything else,
 * so that entirely reasonable request comes back as a 500 with no explanation. Since
 * the endpoint is public, that is a malformed-input bug, not a caller error: normalise
 * the two string forms into the booleans the entity service already understands and
 * leave `'*'`, attribute names and nested objects exactly as they are.
 *
 * @param {*} populate any node of a populate tree
 * @returns {*} the same shape with `'true'` / `'false'` turned into booleans
 */
const normalizePopulate = (populate) => {
  if (populate === 'true') {
    return true;
  }

  if (populate === 'false') {
    return false;
  }

  if (Array.isArray(populate)) {
    return populate.map(normalizePopulate);
  }

  if (populate !== null && typeof populate === 'object') {
    return Object.entries(populate).reduce((normalized, [key, value]) => {
      normalized[key] = normalizePopulate(value);
      return normalized;
    }, {});
  }

  return populate;
};

/**
 * Merge a default populate tree into an incoming query without overriding an explicit
 * caller choice.
 *
 * A client that asks for `?populate=...` knows what it wants — usually because it is
 * asking for *less*, which is the cheap path. Silently replacing that with the full
 * tree would turn an intentionally narrow request into an expensive one.
 *
 * @param {Object} [query] the controller's `ctx.query`
 * @param {Object} defaults the tree from {@link buildSectionsPopulate}
 * @returns {Object} a new query object; the input is never mutated
 */
const withDefaultPopulate = (query, defaults) => {
  const incoming = query || {};

  if (incoming.populate !== undefined && incoming.populate !== null) {
    return { ...incoming, populate: normalizePopulate(incoming.populate) };
  }

  return { ...incoming, populate: defaults };
};

module.exports = {
  buildSectionsPopulate,
  normalizePopulate,
  withDefaultPopulate,
};
