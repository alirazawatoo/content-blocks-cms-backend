'use strict';

/**
 * Idempotent seeder.
 *
 * Runs from `bootstrap()` when `SEED_ON_BOOTSTRAP=true`. It brings a fresh database up
 * to a state a reviewer can actually look at:
 *
 *   1. uploads the seed images,
 *   2. composes and publishes the Home Page required by the challenge brief,
 *   3. creates a few Content Pages,
 *   4. opens the public read permissions the front-end needs,
 *   5. creates the first admin user, if credentials are supplied.
 *
 * Every step is skipped when its work is already done, so booting twice is safe, and
 * every step is individually guarded: a seeding failure logs loudly but never stops
 * the CMS from starting. A half-seeded development database is annoying; a CMS that
 * refuses to boot is worse.
 *
 * Step 5 is the exception to "in bootstrap": see {@link afterServerReady}.
 */

const fs = require('fs');
const path = require('path');

const { HOME_PAGE_UID } = require('../lib/blocks');
const {
  SEED_IMAGES,
  CONTENT_PAGES,
  buildHomePageSections,
  validateHomePageSections,
} = require('./content');

const CONTENT_PAGE_UID = 'api::content-page.content-page';
const ASSET_DIR = path.join(__dirname, 'assets');

/** Public REST actions the Next.js front-end needs without a token. */
const PUBLIC_ACTIONS = [
  'api::home-page.home-page.find',
  'api::content-page.content-page.find',
  'api::content-page.content-page.findOne',
];

/**
 * Upload the seed images, skipping any that are already in the media library.
 *
 * @param {Object} strapi
 * @returns {Promise<Object<string, number>>} seed image key -> media file id
 */
const uploadImages = async (strapi) => {
  const ids = {};
  const uploadService = strapi.plugin('upload').service('upload');

  for (const image of SEED_IMAGES) {
    const filePath = path.join(ASSET_DIR, image.file);

    if (!fs.existsSync(filePath)) {
      strapi.log.warn(`[seed] missing asset ${image.file}, skipping`);
      continue;
    }

    const existing = await strapi
      .query('plugin::upload.file')
      .findOne({ where: { name: image.name } });

    if (existing) {
      ids[image.key] = existing.id;
      continue;
    }

    const [uploaded] = await uploadService.upload({
      data: {
        fileInfo: {
          name: image.name,
          alternativeText: image.alternativeText,
          caption: image.caption,
        },
      },
      files: {
        path: filePath,
        name: image.name,
        type: 'image/png',
        size: fs.statSync(filePath).size,
      },
    });

    ids[image.key] = uploaded.id;
    strapi.log.info(`[seed] uploaded ${image.name}`);
  }

  return ids;
};

/**
 * Create and publish the Home Page, unless it already has sections.
 *
 * @param {Object} strapi
 * @param {Object<string, number>} imageIds
 */
const seedHomePage = async (strapi, imageIds) => {
  const existing = await strapi.entityService.findMany(HOME_PAGE_UID, {
    populate: { sections: true },
    publicationState: 'preview',
  });

  if (existing && Array.isArray(existing.sections) && existing.sections.length) {
    strapi.log.info('[seed] home page already has sections, skipping');
    return;
  }

  const sections = buildHomePageSections((key) => imageIds[key] || null);
  const problems = validateHomePageSections(sections);

  if (problems.length) {
    // The composition is checked in the test suite too; this guard catches a bad
    // edit that only shows up once the registry and the content disagree at runtime.
    problems.forEach((problem) => strapi.log.error(`[seed] ${problem}`));
    return;
  }

  const data = { sections, publishedAt: new Date() };

  if (existing) {
    await strapi.entityService.update(HOME_PAGE_UID, existing.id, { data });
    strapi.log.info('[seed] home page updated');
  } else {
    await strapi.entityService.create(HOME_PAGE_UID, { data });
    strapi.log.info('[seed] home page created');
  }
};

/**
 * Create the Content Pages that do not exist yet.
 *
 * @param {Object} strapi
 */
const seedContentPages = async (strapi) => {
  for (const page of CONTENT_PAGES) {
    const [existing] = await strapi.entityService.findMany(CONTENT_PAGE_UID, {
      filters: { slug: page.slug },
      publicationState: 'preview',
      limit: 1,
    });

    if (existing) {
      continue;
    }

    await strapi.entityService.create(CONTENT_PAGE_UID, {
      data: { ...page, publishedAt: new Date() },
    });
    strapi.log.info(`[seed] content page "${page.slug}" created`);
  }
};

/**
 * Grant the public role the read actions the front-end depends on.
 *
 * Without this the GraphQL query resolves to `null` and the front-end renders its
 * empty state — the single most common "the CMS is running but the site is blank"
 * failure on a fresh Strapi install.
 *
 * @param {Object} strapi
 */
const grantPublicPermissions = async (strapi) => {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[seed] no public role found, skipping permissions');
    return;
  }

  for (const action of PUBLIC_ACTIONS) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (existing) {
      continue;
    }

    await strapi
      .query('plugin::users-permissions.permission')
      .create({ data: { action, role: publicRole.id } });
    strapi.log.info(`[seed] public permission granted: ${action}`);
  }
};

/**
 * Run `fn` once the HTTP server is accepting connections, or immediately if there is
 * no server to wait for (a test harness, say).
 *
 * `Strapi.runLifecyclesFunctions` calls the *application's* bootstrap before the
 * *admin plugin's*, so at `src/index.js` bootstrap time the `strapi-super-admin` role
 * does not exist yet and anything that needs it silently no-ops. Waiting for
 * `listening` puts the work after every plugin bootstrap has finished.
 *
 * @param {Object} strapi
 * @param {() => Promise<void>} fn
 * @returns {boolean} true when the work was deferred, false when it ran inline
 */
const afterServerReady = (strapi, fn) => {
  const httpServer = strapi.server && strapi.server.httpServer;

  if (!httpServer || typeof httpServer.once !== 'function') {
    fn();
    return false;
  }

  httpServer.once('listening', fn);
  return true;
};

/**
 * Create the first super-admin from the environment, so an automated boot does not
 * stop at the admin registration screen.
 *
 * Only ever creates the *first* admin: if any admin already exists the step is a
 * no-op, so this can never be used to inject an account into a live instance.
 *
 * @param {Object} strapi
 */
const seedAdminUser = async (strapi) => {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    strapi.log.info(
      '[seed] SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set, skipping admin user'
    );
    return;
  }

  const adminCount = await strapi.query('admin::user').count({});

  if (adminCount > 0) {
    strapi.log.info('[seed] an admin user already exists, skipping');
    return;
  }

  const superAdminRole = await strapi
    .query('admin::role')
    .findOne({ where: { code: 'strapi-super-admin' } });

  if (!superAdminRole) {
    strapi.log.warn('[seed] super admin role missing, skipping admin user');
    return;
  }

  const userService =
    (strapi.admin && strapi.admin.services && strapi.admin.services.user) ||
    strapi.service('admin::user');

  await userService.create({
    email,
    firstname: process.env.SEED_ADMIN_FIRSTNAME || 'Seed',
    lastname: process.env.SEED_ADMIN_LASTNAME || 'Admin',
    password,
    isActive: true,
    registrationToken: null,
    roles: [superAdminRole.id],
  });

  strapi.log.info(`[seed] super admin created: ${email}`);
};

/** Each step runs independently so one failure does not skip the rest. */
const STEPS = [
  ['permissions', (strapi) => grantPublicPermissions(strapi)],
  ['content pages', (strapi) => seedContentPages(strapi)],
];

/**
 * Entry point called from `src/index.js`.
 *
 * @param {{strapi: Object}} context
 */
const seed = async ({ strapi }) => {
  strapi.log.info('[seed] starting');

  let imageIds = {};

  try {
    imageIds = await uploadImages(strapi);
  } catch (error) {
    strapi.log.error(`[seed] image upload failed: ${error.message}`);
  }

  try {
    await seedHomePage(strapi, imageIds);
  } catch (error) {
    strapi.log.error(`[seed] home page failed: ${error.message}`);
  }

  for (const [name, step] of STEPS) {
    try {
      await step(strapi);
    } catch (error) {
      strapi.log.error(`[seed] ${name} failed: ${error.message}`);
    }
  }

  // The admin roles this needs are created by the admin plugin's own bootstrap,
  // which Strapi runs *after* this one — so it waits for the server instead.
  afterServerReady(strapi, async () => {
    try {
      await seedAdminUser(strapi);
    } catch (error) {
      strapi.log.error(`[seed] admin user failed: ${error.message}`);
    }
  });

  strapi.log.info('[seed] done');
};

module.exports = {
  seed,
  afterServerReady,
  seedAdminUser,
  PUBLIC_ACTIONS,
  CONTENT_PAGE_UID,
};
