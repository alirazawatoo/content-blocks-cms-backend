'use strict';

const {
  DEFAULTS,
  normalizeOptions,
  shouldCache,
  cacheControlValue,
} = require('../src/lib/http-cache');

const options = normalizeOptions();

/** Minimal Koa-shaped context. */
const ctx = (overrides = {}) => ({
  method: 'GET',
  path: '/api/home-page',
  status: 200,
  headers: {},
  response: { headers: {} },
  ...overrides,
});

describe('normalizeOptions', () => {
  it('falls back to the defaults', () => {
    expect(normalizeOptions()).toEqual(DEFAULTS);
  });

  it('accepts overrides from config/middlewares.js', () => {
    const custom = normalizeOptions({ maxAge: 5, staleWhileRevalidate: 50 });

    expect(custom.maxAge).toBe(5);
    expect(custom.staleWhileRevalidate).toBe(50);
  });

  it('ignores an unparseable max age rather than emitting NaN', () => {
    expect(normalizeOptions({ maxAge: 'soon' }).maxAge).toBe(DEFAULTS.maxAge);
  });

  it('can be switched off entirely', () => {
    expect(normalizeOptions({ enabled: false }).enabled).toBe(false);
  });
});

describe('shouldCache', () => {
  it('caches an anonymous content read', () => {
    expect(shouldCache(ctx(), options)).toBe(true);
  });

  it('does not cache when disabled', () => {
    expect(shouldCache(ctx(), normalizeOptions({ enabled: false }))).toBe(false);
  });

  it.each(['POST', 'PUT', 'DELETE'])('does not cache %s', (method) => {
    expect(shouldCache(ctx({ method }), options)).toBe(false);
  });

  it('does not cache a non-200 response', () => {
    expect(shouldCache(ctx({ status: 404 }), options)).toBe(false);
  });

  it('does not cache outside the content API', () => {
    // The admin panel and /graphql must never be handed to a shared cache.
    expect(shouldCache(ctx({ path: '/admin' }), options)).toBe(false);
    expect(shouldCache(ctx({ path: '/graphql' }), options)).toBe(false);
  });

  it('does not cache an authenticated request', () => {
    expect(
      shouldCache(ctx({ headers: { authorization: 'Bearer token' } }), options)
    ).toBe(false);
  });

  it('does not cache a request carrying cookies', () => {
    expect(shouldCache(ctx({ headers: { cookie: 'sid=1' } }), options)).toBe(
      false
    );
  });

  it('does not cache a response that sets a cookie', () => {
    expect(
      shouldCache(
        ctx({ response: { headers: { 'set-cookie': ['sid=1'] } } }),
        options
      )
    ).toBe(false);
  });

  it('never overwrites a Cache-Control a controller already set', () => {
    expect(
      shouldCache(
        ctx({ response: { headers: { 'cache-control': 'no-store' } } }),
        options
      )
    ).toBe(false);
  });
});

describe('cacheControlValue', () => {
  it('is public with a revalidation window', () => {
    expect(cacheControlValue(normalizeOptions({ maxAge: 60 }))).toBe(
      'public, max-age=60, stale-while-revalidate=600'
    );
  });
});
