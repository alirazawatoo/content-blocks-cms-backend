'use strict';

/**
 * home-page controller.
 *
 * Thin by design: delegate, sanitize, transform — the same three steps as the core
 * controller it replaces. The only behaviour it adds is defaulting the populate tree,
 * because a Home Page response without its `sections` is useless to every caller and
 * Strapi does not populate dynamic zones unless asked.
 *
 * Strapi 4.1's core controller has no `sanitizeQuery`; it hands `ctx.query` straight to
 * the service, and the service's `getFetchParams` applies the publication-state default.
 * This follows that contract rather than the one from later 4.x releases.
 *
 * Note this affects REST only. GraphQL derives its own populate from the query's
 * selection set, so `graphql/cms/homepage.graphql` in the front-end already gets a
 * fully populated response without this.
 */

const { createCoreController } = require('@strapi/strapi').factories;

const { HOME_PAGE_UID } = require('../../../lib/blocks');

module.exports = createCoreController(HOME_PAGE_UID, ({ strapi }) => ({
  async find(ctx) {
    const entity = await strapi.service(HOME_PAGE_UID).findRendered(ctx.query);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
