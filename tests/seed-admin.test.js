'use strict';

/**
 * The admin-user seed step, and the lifecycle bug it exists to work around.
 *
 * Strapi runs the *application's* bootstrap before the *admin plugin's*, so the
 * `strapi-super-admin` role does not exist while `src/index.js` is running. Seeding
 * an admin there logs "super admin role missing" and quietly does nothing — a failure
 * that only shows up as an unexpected registration screen on first boot.
 *
 * Nothing here boots Strapi: `strapi` is a hand-rolled double, which is the whole
 * point of keeping the seeder's dependencies down to `query`, `service` and `log`.
 */

const { EventEmitter } = require('events');

const { afterServerReady, seedAdminUser } = require('../src/seed');

const SUPER_ADMIN_ROLE = { id: 7, code: 'strapi-super-admin' };

/**
 * @param {{adminCount?: number, superAdminRole?: Object|null}} [options]
 */
const fakeStrapi = ({ adminCount = 0, superAdminRole = SUPER_ADMIN_ROLE } = {}) => {
  const created = [];

  const queries = {
    'admin::user': { count: async () => adminCount },
    'admin::role': { findOne: async () => superAdminRole },
  };

  return {
    created,
    server: { httpServer: new EventEmitter() },
    log: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
    query: (uid) => queries[uid],
    service: () => ({
      create: async (data) => {
        created.push(data);
        return { id: 1, ...data };
      },
    }),
  };
};

describe('afterServerReady', () => {
  it('defers the work until the HTTP server is listening', () => {
    const strapi = fakeStrapi();
    const work = jest.fn();

    expect(afterServerReady(strapi, work)).toBe(true);
    expect(work).not.toHaveBeenCalled();

    strapi.server.httpServer.emit('listening');

    expect(work).toHaveBeenCalledTimes(1);
  });

  it('only runs the work once', () => {
    const strapi = fakeStrapi();
    const work = jest.fn();

    afterServerReady(strapi, work);
    strapi.server.httpServer.emit('listening');
    strapi.server.httpServer.emit('listening');

    expect(work).toHaveBeenCalledTimes(1);
  });

  it('runs inline when there is no server to wait for', () => {
    const strapi = { ...fakeStrapi(), server: undefined };
    const work = jest.fn();

    expect(afterServerReady(strapi, work)).toBe(false);
    expect(work).toHaveBeenCalledTimes(1);
  });
});

describe('seedAdminUser', () => {
  const withEnv = async (values, fn) => {
    const saved = { ...process.env };
    Object.assign(process.env, values);
    try {
      return await fn();
    } finally {
      process.env = saved;
    }
  };

  const CREDENTIALS = {
    SEED_ADMIN_EMAIL: 'admin@jomi.local',
    SEED_ADMIN_PASSWORD: 'placeholder-password',
  };

  it('creates the first super admin from the environment', async () => {
    const strapi = fakeStrapi();

    await withEnv(CREDENTIALS, () => seedAdminUser(strapi));

    expect(strapi.created).toHaveLength(1);
    expect(strapi.created[0]).toMatchObject({
      email: 'admin@jomi.local',
      isActive: true,
      roles: [SUPER_ADMIN_ROLE.id],
    });
  });

  it('is skipped without credentials, so it cannot create an unasked-for account', async () => {
    const strapi = fakeStrapi();

    await withEnv(
      { SEED_ADMIN_EMAIL: undefined, SEED_ADMIN_PASSWORD: undefined },
      () => seedAdminUser(strapi)
    );

    expect(strapi.created).toHaveLength(0);
  });

  it('refuses once any admin exists, so it can never inject into a live instance', async () => {
    const strapi = fakeStrapi({ adminCount: 1 });

    await withEnv(CREDENTIALS, () => seedAdminUser(strapi));

    expect(strapi.created).toHaveLength(0);
  });

  it('warns instead of throwing when the super-admin role is missing', async () => {
    // Exactly the state the old bootstrap-time call saw on every fresh database.
    const strapi = fakeStrapi({ superAdminRole: null });

    await withEnv(CREDENTIALS, () => seedAdminUser(strapi));

    expect(strapi.created).toHaveLength(0);
    expect(strapi.log.warn).toHaveBeenCalledWith(
      expect.stringContaining('super admin role missing')
    );
  });
});
