# Content Blocks CMS

A Strapi backend for authoring structured homepage content consumed by a separate Next.js frontend. The schema models a homepage as an ordered dynamic zone containing headers, two-column sections, and carousels.

This repository originated from the JOMI CMS coding challenge. The original task context is preserved here as provenance, while this README documents the checked-in implementation rather than an expired submission deadline.

## Content flow

```text
Strapi admin
    |
    v
Home Page single type
    |
    +-- Header
    +-- Two-column block
    +-- Carousel
    |
    v
Strapi GraphQL API
    |
    v
Next.js content renderer
```

## Content types

### Home Page

`src/api/home-page/content-types/home-page/schema.json` defines a draft-and-publish single type with an ordered `sections` dynamic zone.

### Reusable components

- `common.header` — heading and introductory content
- `common.two-column-block` — paired content columns
- `common.carousel` — repeatable carousel content
- `hero.hero-section` — an additional hero component schema
- `content-page` — a separate content-page type retained in the project

The exact fields and media relationships are defined in the JSON component schemas under `src/components`.

## Local setup

```bash
git clone https://github.com/alirazawatoo/content-blocks-cms-backend.git
cd content-blocks-cms-backend
yarn install
cp .env.example .env
yarn develop
```

Open `http://localhost:1337/admin`, create a local administrator, populate the Home Page sections, and publish the entry. The sample environment file uses Strapi application secrets; replace every placeholder for any non-disposable environment.

## Frontend integration

The companion renderer is [`headless-cms-content-web`](https://github.com/alirazawatoo/headless-cms-content-web). It queries the homepage through GraphQL and selects a React component based on each section's GraphQL type name.

When a schema changes:

1. Update the Strapi component or content-type schema.
2. Restart the development CMS if required.
3. Update the frontend GraphQL query.
4. Regenerate the frontend GraphQL types.
5. Add or update the matching section renderer.

## Deployment workflow

Pushes to `main` trigger `.github/workflows/node.js.yml` on a self-hosted runner. The workflow installs dependencies, builds Strapi, copies `/srv/apps/app.env`, and restarts the PM2 process defined by `ecosystem.config.js`.

That is an environment-specific deployment path, not a portable CI check. Anyone reusing or forking this repository should disable or replace it before pushing to `main` unless they control the referenced runner, filesystem path, and PM2 process.

## Current boundaries

- No assertion-bearing automated test suite is tracked.
- Content examples live in the CMS database rather than version-controlled fixtures.
- Permissions for public GraphQL access must be configured through Strapi.
- The deployment workflow depends on a privileged, preconfigured self-hosted host.
- Media storage and database configuration use Strapi defaults unless overridden locally.

## Next improvements

1. Add version-controlled seed content for a reproducible homepage.
2. Document the GraphQL query and representative response alongside the frontend.
3. Add schema validation or integration coverage for the dynamic-zone contract.
4. Replace the host-specific deployment workflow with an explicitly managed environment pipeline.
