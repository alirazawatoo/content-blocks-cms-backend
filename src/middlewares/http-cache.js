'use strict';

/**
 * Adds `Cache-Control` to public content reads. Registered as `global::http-cache`
 * in `config/middlewares.js`; the policy itself lives in `src/lib/http-cache.js` so
 * it can be unit tested without a Koa server.
 */

const {
  normalizeOptions,
  shouldCache,
  cacheControlValue,
} = require('../lib/http-cache');

module.exports = (config) => {
  const options = normalizeOptions(config);

  return async (ctx, next) => {
    await next();

    if (shouldCache(ctx, options)) {
      ctx.set('Cache-Control', cacheControlValue(options));
      // Append rather than set: CORS and controllers may already have added to Vary,
      // and dropping one of their entries lets a CDN serve the wrong variant.
      ctx.vary('Accept-Encoding');
      ctx.vary('Origin');
    }
  };
};
