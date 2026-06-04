'use strict';

/**
 * Policy for the `Cache-Control` header on public content reads.
 *
 * Strapi Community Edition ships no response cache. The cheapest honest win for a
 * read-mostly headless CMS is therefore not an in-process cache — it is telling the
 * CDN or reverse proxy in front of it that public content reads are cacheable, and
 * for how long. `stale-while-revalidate` means a burst of traffic is served from the
 * edge while one request refreshes it, which is the behaviour that actually protects
 * the database.
 *
 * Deliberately conservative: anything that could be personalised is left uncached.
 * A wrongly cached authenticated response is a data leak, not a performance bug.
 */

const { envInt } = require('./env');

const DEFAULTS = {
  enabled: true,
  maxAge: 60,
  staleWhileRevalidate: 600,
  prefixes: ['/api/'],
};

/**
 * @param {Object} [config] middleware config from `config/middlewares.js`
 * @returns {{enabled: boolean, maxAge: number, staleWhileRevalidate: number, prefixes: string[]}}
 */
const normalizeOptions = (config = {}) => ({
  enabled: config.enabled !== undefined ? Boolean(config.enabled) : DEFAULTS.enabled,
  maxAge: envInt(config.maxAge, DEFAULTS.maxAge),
  staleWhileRevalidate: envInt(
    config.staleWhileRevalidate,
    DEFAULTS.staleWhileRevalidate
  ),
  prefixes:
    Array.isArray(config.prefixes) && config.prefixes.length
      ? config.prefixes
      : DEFAULTS.prefixes,
});

/**
 * Decide whether a finished request may be cached publicly.
 *
 * @param {{method: string, path: string, status: number, headers: Object, response: Object}} ctx
 *        a Koa context, or the minimal shape of one
 * @param {Object} options from {@link normalizeOptions}
 * @returns {boolean}
 */
const shouldCache = (ctx, options) => {
  if (!options.enabled) {
    return false;
  }

  if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
    return false;
  }

  if (ctx.status !== 200) {
    return false;
  }

  if (!options.prefixes.some((prefix) => ctx.path.startsWith(prefix))) {
    return false;
  }

  // Authenticated or session-bearing responses are per-user by definition.
  const headers = ctx.headers || {};
  if (headers.authorization || headers.cookie) {
    return false;
  }

  const responseHeaders = (ctx.response && ctx.response.headers) || {};
  if (responseHeaders['set-cookie']) {
    return false;
  }

  // Never overwrite a header a controller set deliberately.
  return !responseHeaders['cache-control'];
};

/**
 * @param {Object} options from {@link normalizeOptions}
 * @returns {string} the `Cache-Control` value
 */
const cacheControlValue = (options) =>
  `public, max-age=${options.maxAge}, stale-while-revalidate=${options.staleWhileRevalidate}`;

module.exports = { DEFAULTS, normalizeOptions, shouldCache, cacheControlValue };
