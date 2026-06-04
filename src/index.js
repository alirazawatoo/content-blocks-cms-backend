'use strict';

const { envBool } = require('./lib/env');
const { seed } = require('./seed');

module.exports = {
  /**
   * Runs before the application is initialized. Nothing to extend here — the content
   * model is declarative and the customisations live in the api/ folders.
   */
  register(/* { strapi } */) {},

  /**
   * Runs once the application is initialized but before it accepts traffic.
   *
   * Seeding is opt-in via `SEED_ON_BOOTSTRAP` and idempotent, so it is safe to leave
   * enabled in development and in the Docker image; it is off by default everywhere
   * else.
   */
  async bootstrap({ strapi }) {
    if (!envBool(process.env.SEED_ON_BOOTSTRAP, false)) {
      return;
    }

    await seed({ strapi });
  },
};
