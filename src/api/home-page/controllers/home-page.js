'use strict';

/**
 * home-page controller.
 *
 * Thin by design: validate, sanitize, delegate, sanitize, transform, the same steps
 * as the core controller it replaces. The only behaviour it adds is defaulting the
 * populate tree, because a Home Page response without its `sections` is useless to
 * every caller and Strapi does not populate dynamic zones unless asked.
 *
 * The query is validated and sanitized before it reaches the service, so a public
 * caller cannot filter or populate on private attributes.
 *
 * Note this affects REST only. GraphQL derives its own populate from the query's
 * selection set, so `graphql/cms/homepage.graphql` in the front-end already gets a
 * fully populated response without this.
 */

const { createCoreController } = require('@strapi/strapi').factories;

const { HOME_PAGE_UID } = require('../../../lib/blocks');

module.exports = createCoreController(HOME_PAGE_UID, ({ strapi }) => ({
  async find(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQuery = await this.sanitizeQuery(ctx);

    const entity = await strapi.service(HOME_PAGE_UID).findRendered(sanitizedQuery);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
