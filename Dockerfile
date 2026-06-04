# syntax=docker/dockerfile:1

# Strapi 4.1 supports Node 14 and 16 only, so the image pins 16 rather than
# tracking latest. Debian slim rather than Alpine because sharp and better-sqlite3
# both publish glibc prebuilds; on musl they are compiled from source at install
# time, which triples the build and occasionally fails outright.
ARG NODE_VERSION=16-bullseye-slim

# ---------------------------------------------------------------------------
# deps — every dependency, with the toolchain needed to build native modules
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps

WORKDIR /opt/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 600000

# ---------------------------------------------------------------------------
# build — compile the admin panel
# ---------------------------------------------------------------------------
FROM deps AS build

ENV NODE_ENV=production

COPY . .

RUN yarn build --no-optimization

# ---------------------------------------------------------------------------
# test — lint and unit tests. Build this target in CI: `docker build --target test .`
# ---------------------------------------------------------------------------
FROM build AS test

ENV NODE_ENV=test

RUN yarn lint && yarn test

# ---------------------------------------------------------------------------
# prune — drop devDependencies without rebuilding the native modules
# ---------------------------------------------------------------------------
FROM build AS prune

RUN yarn install --frozen-lockfile --production --ignore-scripts \
  && yarn cache clean

# ---------------------------------------------------------------------------
# runtime — no compiler, no dev dependencies, not root
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337

WORKDIR /opt/app

COPY --from=prune --chown=node:node /opt/app/node_modules ./node_modules
COPY --from=build --chown=node:node /opt/app/build ./build
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node favicon.ico ./

# `.tmp` holds the SQLite file when DATABASE_CLIENT=sqlite; `public/uploads` holds
# media when the upload provider is local. Both must be writable by the app user.
RUN mkdir -p .tmp public/uploads && chown -R node:node /opt/app

USER node

EXPOSE 1337

# Strapi answers /_health with 204 once it is accepting traffic. Using node itself
# keeps curl and wget out of the runtime image.
HEALTHCHECK --interval=15s --timeout=5s --start-period=90s --retries=10 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||1337)+'/_health',r=>process.exit(r.statusCode<400?0:1)).on('error',()=>process.exit(1))"

CMD ["yarn", "start"]
