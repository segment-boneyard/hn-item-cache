var defaults     = require('defaults')
  , EventEmitter = require('events').EventEmitter
  , hnItem       = require('hn-item')
  , LRU          = require('lru-cache')
  , ms           = require('ms')
  , util         = require('util');


module.exports = HNItemCache;

/**
 * HNItemCache - accepts same options as LRU Cache to determine
 * caching behavior.
 * 
 * @param {Object} options
 */

function HNItemCache (options) {
  EventEmitter.call(this);

  options || (options = {});
  defaults(options, {
    maxAge : ms('1m'),
    max    : 10000
  });

  this.reqs  = {};
  this.cache = LRU(options);
}

util.inherits(HNItemCache, EventEmitter);


/**
 * Get an item by its url. Will first check the cache.
 * 
 * @param  {String}   url
 * @param  {Function} callback (err, item)
 */

HNItemCache.prototype.get = function (url, callback) {
  var item = this.cache.peek(url); // peek to avoid updating.
  if (item) return process.nextTick(function () { callback(null, item); });
  else this.lookup(url, callback);
};


/**
 * Looks to see whether there is already an outbound request, makes one
 * if it doesn't yet exist.
 *
 * @param {String}   url
 * @param {Function} callback
 */

HNItemCache.prototype.lookup = function (url, callback) {
  var req = this.reqs[url];

  if (!req) {
    var self = this;

    req = hnItem(url);
    req
      .on('data', function (item)  { self.update(url, item); })
      .on('error', function (err)  { delete self.reqs[url]; });
    this.reqs[url] = req;
  }

  addListeners(req, callback);
};


/**
 * Update the cache with the given url.
 */

HNItemCache.prototype.update = function (url, item) {
  this.cache.set(url, item);
  delete this.reqs[url];
};


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
