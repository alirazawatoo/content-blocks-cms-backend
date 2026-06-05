'use strict';

/**
 * The config files are plain functions of `{ env }`, so the decisions in them are
 * testable without booting Strapi. Worth doing: a wrong value here is the difference
 * between an API that is merely slow and one that can be taken down by a single
 * hand-written query.
 */

const path = require('path');

const { makeEnv } = require('./helpers/env');

const database = require('../config/database');
const plugins = require('../config/plugins');
const server = require('../config/server');
const middlewares = require('../config/middlewares');

describe('config/database', () => {
  it('defaults to SQLite so a fresh clone needs no services', () => {
    const { connection } = database({ env: makeEnv() });

    expect(connection.client).toBe('sqlite');
    expect(connection.connection.filename).toBe(
      path.join(__dirname, '..', '.tmp/data.db')
    );
    expect(connection.useNullAsDefault).toBe(true);
  });

  it('resolves a relative SQLite path against the project root', () => {
    const { connection } = database({
      env: makeEnv({ DATABASE_FILENAME: 'data/dev.db' }),
    });

    expect(connection.connection.filename).toBe(
      path.join(__dirname, '..', 'data/dev.db')
    );
  });

  it('honours an absolute SQLite path verbatim', () => {
    // The original code ran this through path.join, which silently turned
    // /var/lib/strapi.db into <project>/var/lib/strapi.db.
    const { connection } = database({
      env: makeEnv({ DATABASE_FILENAME: '/var/lib/strapi/data.db' }),
    });

    expect(connection.connection.filename).toBe('/var/lib/strapi/data.db');
  });

  it('switches to Postgres on one variable', () => {
    const { connection } = database({
      env: makeEnv({
        DATABASE_CLIENT: 'postgres',
        DATABASE_HOST: 'db',
        DATABASE_PORT: '5432',
        DATABASE_NAME: 'jomi',
        DATABASE_USERNAME: 'jomi',
        DATABASE_PASSWORD: 'secret',
      }),
    });

    expect(connection.client).toBe('postgres');
    expect(connection.connection.host).toBe('db');
    expect(connection.connection.database).toBe('jomi');
  });

  it('bounds the Postgres connection pool', () => {
    const { connection } = database({
      env: makeEnv({ DATABASE_CLIENT: 'postgres' }),
    });

    expect(connection.pool.min).toBe(2);
    expect(connection.pool.max).toBe(10);
  });

  it('fails loudly on an unsupported client', () => {
    expect(() => database({ env: makeEnv({ DATABASE_CLIENT: 'mongo' }) })).toThrow(
      /Unsupported DATABASE_CLIENT "mongo"/
    );
  });
});

describe('config/plugins graphql', () => {
  const graphql = (env) => plugins({ env }).graphql.config;

  it('limits query depth', () => {
    // The front-end's deepest query is nine levels; without a limit a cyclic
    // selection set can be nested until the process dies.
    expect(graphql(makeEnv()).depthLimit).toBe(12);
  });

  it('limits how much one query may ask for', () => {
    expect(graphql(makeEnv()).amountLimit).toBe(100);
  });

  it('keeps introspection on outside production, for the front-end codegen', () => {
    expect(graphql(makeEnv()).apolloServer.introspection).toBe(true);
  });

  it('turns introspection off in production', () => {
    expect(
      graphql(makeEnv({ NODE_ENV: 'production' })).apolloServer.introspection
    ).toBe(false);
  });

  it('can be forced back on in production, deliberately', () => {
    expect(
      graphql(makeEnv({ NODE_ENV: 'production', GRAPHQL_INTROSPECTION: 'true' }))
        .apolloServer.introspection
    ).toBe(true);
  });

  it('never exposes the playground automatically', () => {
    expect(graphql(makeEnv()).playgroundAlways).toBe(false);
  });
});

describe('config/plugins upload', () => {
  it('uses local storage by default', () => {
    const upload = plugins({ env: makeEnv() }).upload.config;

    expect(upload.provider).toBe('local');
    expect(upload.providerOptions).toEqual({});
  });

  it('swaps provider without a code change', () => {
    const upload = plugins({
      env: makeEnv({
        UPLOAD_PROVIDER: 'aws-s3',
        UPLOAD_PROVIDER_OPTIONS: '{"region":"eu-west-1"}',
      }),
    }).upload.config;

    expect(upload.provider).toBe('aws-s3');
    expect(upload.providerOptions).toEqual({ region: 'eu-west-1' });
  });
});

describe('config/server', () => {
  it('leaves the public URL unset unless told', () => {
    expect(server({ env: makeEnv() }).url).toBeUndefined();
  });

  it('takes the public URL and proxy flag from the environment', () => {
    const config = server({
      env: makeEnv({ PUBLIC_URL: 'https://cms.example.com', IS_PROXIED: 'true' }),
    });

    expect(config.url).toBe('https://cms.example.com');
    expect(config.proxy).toBe(true);
  });
});

describe('config/middlewares', () => {
  const stack = middlewares({ env: makeEnv() });
  const names = stack.map((entry) =>
    typeof entry === 'string' ? entry : entry.name
  );

  it('keeps the Strapi defaults', () => {
    for (const name of ['strapi::errors', 'strapi::security', 'strapi::body']) {
      expect(names).toContain(name);
    }
  });

  it('runs the cache middleware immediately inside the error handler', () => {
    expect(names[0]).toBe('strapi::errors');
    expect(names[1]).toBe('global::http-cache');
  });

  it('allows every origin by default and an allow-list when configured', () => {
    const cors = (env) =>
      middlewares({ env }).find(
        (entry) => typeof entry !== 'string' && entry.name === 'strapi::cors'
      ).config;

    // A string, not ['*']: Strapi matches arrays exactly, so ['*'] admits nobody.
    expect(cors(makeEnv()).origin).toBe('*');
    expect(cors(makeEnv({ CORS_ORIGIN: '*' })).origin).toBe('*');
    expect(
      cors(makeEnv({ CORS_ORIGIN: 'https://jomi.com, https://www.jomi.com' }))
        .origin
    ).toEqual(['https://jomi.com', 'https://www.jomi.com']);
  });
});
