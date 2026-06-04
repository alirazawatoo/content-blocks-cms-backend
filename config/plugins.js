'use strict';

/**
 * Plugin configuration.
 *
 * Both blocks here exist for a reason the default cannot cover: the GraphQL limits
 * because this API is queried by an untrusted browser, and the upload provider
 * because local disk storage does not survive a container restart.
 */

module.exports = ({ env }) => ({
  graphql: {
    config: {
      endpoint: '/graphql',

      // The playground is a development affordance. `playgroundAlways` would expose
      // it in production, where it is an invitation to explore the schema.
      playgroundAlways: false,

      // Introspection is what `yarn gen` in the front-end needs to generate its
      // typed hooks, so it stays on outside production and off inside it.
      apolloServer: {
        introspection: env.bool(
          'GRAPHQL_INTROSPECTION',
          env('NODE_ENV', 'development') !== 'production'
        ),
      },

      // A GraphQL endpoint with no depth limit lets one request walk a cyclic schema
      // until the process runs out of memory. The front-end's deepest query
      // (homePage -> data -> attributes -> sections -> Item -> Image -> data ->
      // attributes -> url) is nine levels, so twelve leaves headroom for one more
      // nested component without leaving the door open.
      depthLimit: env.int('GRAPHQL_DEPTH_LIMIT', 12),

      // Caps `pagination[limit]` and the size of any populated list, so a single
      // query cannot ask for every row in a table.
      amountLimit: env.int('GRAPHQL_AMOUNT_LIMIT', 100),

      // Shadow CRUD is what generates the `homePage` query from the content type.
      shadowCRUD: true,
    },
  },

  upload: {
    config: {
      // Local disk is right for development and for this challenge. Swapping in S3,
      // Cloudinary or any other Strapi upload provider is two environment variables
      // plus the provider package — no code change, because the provider name and
      // its options are read from the environment rather than hardcoded.
      provider: env('UPLOAD_PROVIDER', 'local'),
      providerOptions: JSON.parse(env('UPLOAD_PROVIDER_OPTIONS', '{}')),
      sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 20 * 1024 * 1024),
    },
  },
});
