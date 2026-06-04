'use strict';

/**
 * The middleware stack, outermost first.
 *
 * Two changes from the Strapi default: CORS is driven by the environment instead of
 * allowing every origin, and `global::http-cache` adds `Cache-Control` to public
 * content reads (see `src/lib/http-cache.js`). It sits directly after the error
 * handler so it observes the final status of every request, including errors it then
 * declines to cache.
 */

module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'global::http-cache',
    config: {
      enabled: env.bool('HTTP_CACHE_ENABLED', true),
      maxAge: env.int('HTTP_CACHE_MAX_AGE', 60),
      staleWhileRevalidate: env.int('HTTP_CACHE_SWR', 600),
    },
  },
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // A comma-separated allow-list; defaults to `*` so a fresh clone works, which
      // is also why the README tells you to set it before deploying.
      origin: env.array('CORS_ORIGIN', ['*']),
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
