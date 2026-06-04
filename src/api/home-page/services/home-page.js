'use strict';

/**
 * home-page service.
 *
 * Extends the core service with one method: reading the Home Page the way every
 * consumer actually wants it — with the `sections` dynamic zone populated. The
 * populate tree itself lives in `src/lib/populate.js` and is derived from the block
 * registry, so this file stays thin and free of content-model knowledge.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const { HOME_PAGE_UID } = require('../../../lib/blocks');
const {
  buildSectionsPopulate,
  withDefaultPopulate,
} = require('../../../lib/populate');

module.exports = createCoreService(HOME_PAGE_UID, ({ strapi }) => ({
  /** The populate tree applied when the caller does not specify one. */
  defaultPopulate() {
    return buildSectionsPopulate();
  },

  /**
   * Read the Home Page with its dynamic zone populated.
   *
   * @param {Object} [params] entity-service params; an explicit `populate` wins.
   * @returns {Promise<Object|null>} the single-type entity, or null if none exists.
   */
  async findRendered(params = {}) {
    const query = withDefaultPopulate(params, this.defaultPopulate());

    // getFetchParams is the core service's own helper: it applies
    // `publicationState: 'live'` unless the caller overrode it, so drafts stay
    // invisible to the public API without this file restating that rule.
    return strapi.entityService.findMany(HOME_PAGE_UID, this.getFetchParams(query));
  },
}));
