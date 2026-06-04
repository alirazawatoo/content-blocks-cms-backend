'use strict';

/**
 * Environment parsing helpers.
 *
 * Strapi's own `env()` helper is only injected into `config/*`, and `src/` code has to
 * read `process.env` directly. These two functions keep that from turning into ad-hoc
 * truthiness checks, where `SEED_ON_BOOTSTRAP=false` would famously enable seeding.
 */

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
const FALSE_VALUES = new Set(['0', 'false', 'no', 'off', '']);

/**
 * @param {string|undefined} value raw environment value
 * @param {boolean} [fallback=false] used when the value is unset or unrecognised
 * @returns {boolean}
 */
const envBool = (value, fallback = false) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();

  if (TRUE_VALUES.has(normalized)) {
    return true;
  }

  if (FALSE_VALUES.has(normalized)) {
    return false;
  }

  return fallback;
};

/**
 * @param {string|undefined} value raw environment value
 * @param {number} fallback used when the value is unset or not a finite number
 * @returns {number}
 */
const envInt = (value, fallback) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return fallback;
  }

  const parsed = Number.parseInt(String(value), 10);

  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = { envBool, envInt };
