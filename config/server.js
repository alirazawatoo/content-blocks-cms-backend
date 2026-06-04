'use strict';

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  // Public origin of this instance. Strapi uses it to build absolute media URLs and
  // admin links; behind a reverse proxy or a published Docker port it is not the
  // same as `host:port`, and leaving it unset is why uploaded images come back with
  // an unreachable URL.
  url: env('PUBLIC_URL', undefined),

  // Trust `X-Forwarded-*` when a proxy terminates TLS in front of Strapi.
  proxy: env.bool('IS_PROXIED', false),

  app: {
    keys: env.array('APP_KEYS'),
  },
});
