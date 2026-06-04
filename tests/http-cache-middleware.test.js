'use strict';

const httpCache = require('../src/middlewares/http-cache');

/** Koa-shaped context that records headers the way Koa's `set` and `vary` do. */
const fakeCtx = (overrides = {}) => {
  const responseHeaders = {};
  return {
    method: 'GET',
    path: '/api/home-page',
    status: 200,
    headers: {},
    response: { headers: responseHeaders },
    set(name, value) {
      responseHeaders[name.toLowerCase()] = value;
    },
    vary(field) {
      const current = responseHeaders.vary ? responseHeaders.vary.split(/,\s*/) : [];
      if (!current.includes(field)) {
        responseHeaders.vary = [...current, field].join(', ');
      }
    },
    ...overrides,
  };
};

describe('global::http-cache middleware', () => {
  const middleware = httpCache({ maxAge: 30, staleWhileRevalidate: 300 });

  it('marks an anonymous content read as publicly cacheable', async () => {
    const ctx = fakeCtx();

    await middleware(ctx, async () => {});

    expect(ctx.response.headers['cache-control']).toBe(
      'public, max-age=30, stale-while-revalidate=300'
    );
    expect(ctx.response.headers.vary).toBe('Accept-Encoding, Origin');
  });

  it('keeps Vary entries added further down the stack', async () => {
    const ctx = fakeCtx();

    await middleware(ctx, async () => {
      ctx.vary('Origin');
      ctx.vary('Accept-Language');
    });

    expect(ctx.response.headers.vary).toBe('Origin, Accept-Language, Accept-Encoding');
  });

  it('decides after the downstream handler has set the final status', async () => {
    const ctx = fakeCtx();

    await middleware(ctx, async () => {
      ctx.status = 404;
    });

    expect(ctx.response.headers['cache-control']).toBeUndefined();
    expect(ctx.response.headers.vary).toBeUndefined();
  });
});
