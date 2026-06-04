'use strict';

/**
 * content-page controller.
 *
 * Plain core controller — Content Pages have no dynamic zone and no relations, so
 * the generated CRUD is exactly right and adding to it would be noise.
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::content-page.content-page');
