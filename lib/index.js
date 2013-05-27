/**
 * Module dependencies.
 */

var HNItemCache = require('./cache');

/**
 * Add default cache.
 */

var cache = new HNItemCache();

/**
 * Module exports.
 *
 * @param {String}   url
 * @param {Function} callback
 */

module.exports = function (url, callback) {
  return cache.get(url, callback);
};

/**
 * Export Cache.
 */

module.exports.HNItemCache = HNItemCache;
