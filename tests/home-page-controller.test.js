'use strict';

/**
 * The Home Page `find` override. `@strapi/strapi` is mocked so the controller's own
 * steps can be checked without booting the CMS: the point is that the caller's query
 * is validated and sanitized before it reaches the service, exactly as the core
 * controller would do, and only the sanitized copy is used.
 */

jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: (uid, extend) => ({ uid, extend }),
  },
}));

const controller = require('../src/api/home-page/controllers/home-page');
const { HOME_PAGE_UID } = require('../src/lib/blocks');

const setup = () => {
  const calls = [];
  const findRendered = jest.fn(async (query) => {
    calls.push('findRendered');
    return { id: 1, query };
  });
  const strapi = { service: jest.fn(() => ({ findRendered })) };

  const core = {
    validateQuery: jest.fn(async () => calls.push('validateQuery')),
    sanitizeQuery: jest.fn(async () => {
      calls.push('sanitizeQuery');
      return { populate: 'sanitized' };
    }),
    sanitizeOutput: jest.fn(async (entity) => {
      calls.push('sanitizeOutput');
      return entity;
    }),
    transformResponse: jest.fn((entity) => ({ data: entity })),
  };

  const find = controller.extend({ strapi }).find.bind(core);
  return { find, core, strapi, findRendered, calls };
};

describe('home-page controller', () => {
  it('extends the Home Page single type', () => {
    expect(controller.uid).toBe(HOME_PAGE_UID);
  });

  it('validates and sanitizes the query before reading', async () => {
    const { find, calls } = setup();

    await find({ query: { populate: '*' } });

    expect(calls).toEqual([
      'validateQuery',
      'sanitizeQuery',
      'findRendered',
      'sanitizeOutput',
    ]);
  });

  it('passes only the sanitized query to the service', async () => {
    const { find, findRendered, strapi } = setup();

    await find({ query: { filters: { private: { $eq: 'x' } } } });

    expect(strapi.service).toHaveBeenCalledWith(HOME_PAGE_UID);
    expect(findRendered).toHaveBeenCalledWith({ populate: 'sanitized' });
  });

  it('returns the transformed, sanitized entity', async () => {
    const { find } = setup();

    await expect(find({ query: {} })).resolves.toEqual({
      data: { id: 1, query: { populate: 'sanitized' } },
    });
  });

  it('stops before reading when validation rejects the query', async () => {
    const { find, core, findRendered } = setup();
    core.validateQuery.mockRejectedValueOnce(new Error('Invalid key private'));

    await expect(find({ query: {} })).rejects.toThrow('Invalid key private');
    expect(findRendered).not.toHaveBeenCalled();
  });
});
