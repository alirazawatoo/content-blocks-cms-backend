'use strict';

/**
 * A stand-in for the `env` helper Strapi injects into `config/*`.
 *
 * The config files are plain functions of `{ env }`, which is what lets them be tested
 * without booting Strapi — this helper is the only scaffolding that needs.
 */

/**
 * @param {Object<string, string>} [values] the fake environment
 * @returns {Function} an `env`-compatible helper
 */
const makeEnv = (values = {}) => {
  const read = (key, fallback) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : fallback;

  const env = (key, fallback) => read(key, fallback);

  env.int = (key, fallback) => {
    const value = read(key, undefined);
    return value === undefined ? fallback : Number.parseInt(value, 10);
  };

  env.bool = (key, fallback) => {
    const value = read(key, undefined);
    if (value === undefined) {
      return fallback;
    }
    return value === true || value === 'true';
  };

  env.array = (key, fallback) => {
    const value = read(key, undefined);
    if (value === undefined) {
      return fallback;
    }
    return String(value).split(',').map((entry) => entry.trim());
  };

  return env;
};

module.exports = { makeEnv };
