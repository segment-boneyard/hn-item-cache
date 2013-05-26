
var LRU     = require('lru-cache')
  , hnScore = require('hn-score')
  , ms      = require('ms');


var reqs  = {}
  , cache = LRU({ max : 10000, ms : ms('1m') });



module.exports = function (item, callback) {
  var score = cache.peek(item); // peek to avoid updating.
  if (score) return process.nextTick(function () { callback(null, score); });

  lookup(item, callback);
};


/**
 * Looks to see whether there is already an outbound request
 * @param  {String}   item
 * @param  {Function} callback
 */
function lookup (item, callback) {
  var req = reqs[item];

  if (!req) {
    req = hnScore(item);
    req
      .on('data', function (score) { updateCache(item, score); })
      .on('error', function (err)  { delete reqs[item]; });
    reqs[item] = req;
  }

  addListeners(req, callback);
}


/**
 * Add listeners for a currently outbound request.
 * @param {HNScoreRequest} req
 * @param {Function}       callback
 */
function addListeners (req, callback) {
  req
    .once('data',  function (score) { callback(null, score); })
    .once('error', function (err)  { callback(err); });
}


/**
 * Update the cache with the new score
 * @param  {String} item
 * @param  {Number} score
 */
function updateCache (item, score) {
  cache.set(item, score);
  delete reqs[item];
}