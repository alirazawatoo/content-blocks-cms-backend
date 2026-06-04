'use strict';

const path = require('path');

/**
 * Database configuration.
 *
 * SQLite is the default because it keeps `yarn develop` a zero-dependency command,
 * which is what a code challenge wants. Postgres is a one-variable switch
 * (`DATABASE_CLIENT=postgres`) and is what `docker compose up` uses, because SQLite's
 * single-writer lock is the wrong answer the moment more than one editor saves at the
 * same time.
 */

/**
 * SQLite file paths are resolved against the project root so that a relative
 * `DATABASE_FILENAME` behaves the way the `.env.example` implies — while an absolute
 * path (a mounted volume, say) is still honoured verbatim.
 *
 * @param {string} filename
 * @returns {string}
 */
const resolveSqlitePath = (filename) =>
  path.isAbsolute(filename)
    ? filename
    : path.join(__dirname, '..', filename);

const connections = {
  sqlite: ({ env }) => ({
    client: 'sqlite',
    connection: {
      filename: resolveSqlitePath(env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  }),

  postgres: ({ env }) => ({
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
      schema: env('DATABASE_SCHEMA', 'public'),
    },
    // Sized for a small instance. The upper bound matters more than the lower one:
    // it is what stops a traffic spike from opening more connections than Postgres
    // will accept, turning a slow page into a hard outage.
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
  }),
};

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const build = connections[client];

  if (!build) {
    throw new Error(
      `Unsupported DATABASE_CLIENT "${client}". Supported: ${Object.keys(
        connections
      ).join(', ')}.`
    );
  }

  return { connection: build({ env }) };
};

module.exports.connections = connections;
module.exports.resolveSqlitePath = resolveSqlitePath;
