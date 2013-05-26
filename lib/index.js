
/**
 * Module dependencies.
 */

var LRU    = require('lru-cache')
  , hnItem = require('hn-item')
  , ms     = require('ms');


var reqs  = {}
  , cache = LRU({ max : 10000, ms : ms('1m') });


/**
 * Module exports.
 *
 * @param {String}   key
 * @param {Function} callback
 */

module.exports = function (key, callback) {
  var item = cache.peek(key); // peek to avoid updating.
  if (item) return process.nextTick(function () { callback(null, item); });
  lookup(key, callback);
};


/**
 * Looks to see whether there is already an outbound request.
 *
 * @param {String}   key
 * @param {Function} callback
 */

function lookup (key, callback) {
  var req = reqs[key];

  if (!req) {
    req = hnItem(key);
    req
      .on('data', function (item) { updateCache(key, item); })
      .on('error', function (err)  { delete reqs[key]; });
    reqs[key] = req;
  }

  addListeners(req, callback);
}


/**
 * Add listeners for a currently outbound request.
 *
 * @param {HNItemRequest} req
 * @param {Function}      callback
 */

function addListeners (req, callback) {
  req
    .once('data',  function (item) { callback(null, item); })
    .once('error', function (err)  { callback(err); });
}


/**
 * Update the cache with the new item.
 *
 * @param {String} key
 * @param {Number} item
 */

function updateCache (key, item) {
  cache.set(key, item);
  delete reqs[key];
}