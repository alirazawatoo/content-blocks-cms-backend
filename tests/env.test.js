'use strict';

const { envBool, envInt } = require('../src/lib/env');

describe('envBool', () => {
  it.each(['1', 'true', 'TRUE', ' yes ', 'on'])('reads %p as true', (value) => {
    expect(envBool(value)).toBe(true);
  });

  it.each(['0', 'false', 'no', 'off', ''])('reads %p as false', (value) => {
    // The one that matters: SEED_ON_BOOTSTRAP=false must not seed.
    expect(envBool(value, true)).toBe(false);
  });

  it('falls back when unset', () => {
    expect(envBool(undefined, true)).toBe(true);
    expect(envBool(undefined)).toBe(false);
  });

  it('falls back on nonsense rather than guessing', () => {
    expect(envBool('maybe', true)).toBe(true);
    expect(envBool('maybe', false)).toBe(false);
  });
});

describe('envInt', () => {
  it('parses an integer', () => {
    expect(envInt('42', 1)).toBe(42);
  });

  it('accepts a number that is already a number', () => {
    expect(envInt(7, 1)).toBe(7);
  });

  it('falls back when unset or empty', () => {
    expect(envInt(undefined, 9)).toBe(9);
    expect(envInt('   ', 9)).toBe(9);
  });

  it('falls back instead of returning NaN', () => {
    expect(envInt('soon', 9)).toBe(9);
  });
});
