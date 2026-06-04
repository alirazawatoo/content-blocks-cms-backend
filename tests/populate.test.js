'use strict';

const { BLOCKS, SECTIONS_ATTRIBUTE } = require('../src/lib/blocks');
const {
  buildSectionsPopulate,
  normalizePopulate,
  withDefaultPopulate,
} = require('../src/lib/populate');

describe('buildSectionsPopulate', () => {
  const populate = buildSectionsPopulate();
  const inner = populate[SECTIONS_ATTRIBUTE].populate;

  it('populates the dynamic zone itself', () => {
    expect(populate).toHaveProperty(SECTIONS_ATTRIBUTE);
  });

  it('populates every media field declared by any block', () => {
    const mediaFields = Object.values(BLOCKS).flatMap((b) => b.media);

    for (const field of mediaFields) {
      expect(inner[field]).toBe(true);
    }
  });

  it('populates nested blocks and their media', () => {
    // The carousel's items are Two-Column Blocks with their own images: one level
    // of nesting the front-end depends on and Strapi will not infer.
    expect(inner.Item).toEqual({ populate: { Image: true } });
  });

  it('asks for nothing that no block declares', () => {
    const declared = new Set(
      Object.values(BLOCKS).flatMap((b) => [
        ...b.media,
        ...Object.keys(b.children),
      ])
    );

    expect(Object.keys(inner).sort()).toEqual([...declared].sort());
  });
});

describe('withDefaultPopulate', () => {
  const defaults = buildSectionsPopulate();

  it('applies the defaults when the caller asked for nothing', () => {
    expect(withDefaultPopulate({}, defaults).populate).toEqual(defaults);
  });

  it('applies the defaults when there is no query at all', () => {
    expect(withDefaultPopulate(undefined, defaults).populate).toEqual(defaults);
  });

  it('leaves an explicit populate alone', () => {
    // A caller narrowing the response is choosing the cheap path on purpose.
    const query = { populate: { sections: true } };

    expect(withDefaultPopulate(query, defaults).populate).toEqual({
      sections: true,
    });
  });

  it('respects an explicit empty populate', () => {
    expect(withDefaultPopulate({ populate: {} }, defaults).populate).toEqual({});
  });

  it('keeps the rest of the query', () => {
    const query = { filters: { id: 1 }, locale: 'en' };
    const result = withDefaultPopulate(query, defaults);

    expect(result.filters).toEqual({ id: 1 });
    expect(result.locale).toBe('en');
  });

  it('does not mutate the query it was given', () => {
    const query = { locale: 'en' };
    withDefaultPopulate(query, defaults);

    expect(query).toEqual({ locale: 'en' });
  });

  it('coerces the string booleans a query string produces', () => {
    // `?populate[sections]=true` used to reach the entity service as the string
    // 'true' and come back as an unexplained 500 on a public endpoint.
    const result = withDefaultPopulate({ populate: { sections: 'true' } }, defaults);

    expect(result.populate).toEqual({ sections: true });
  });
});

describe('normalizePopulate', () => {
  it('turns the two string booleans into booleans', () => {
    expect(normalizePopulate('true')).toBe(true);
    expect(normalizePopulate('false')).toBe(false);
  });

  it('leaves "*" and attribute names alone', () => {
    expect(normalizePopulate('*')).toBe('*');
    expect(normalizePopulate(['sections', 'Image'])).toEqual(['sections', 'Image']);
  });

  it('reaches into nested populate trees', () => {
    expect(
      normalizePopulate({ sections: { populate: { Image: 'true', Item: 'false' } } })
    ).toEqual({ sections: { populate: { Image: true, Item: false } } });
  });

  it('passes real booleans and objects through untouched', () => {
    expect(normalizePopulate({ sections: true })).toEqual({ sections: true });
    expect(normalizePopulate(undefined)).toBeUndefined();
    expect(normalizePopulate(null)).toBeNull();
  });
});
