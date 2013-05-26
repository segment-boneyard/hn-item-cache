
var cache = require('../');

var start = Date.now();

cache('http://paulgraham.com/twitter.html', function (err, score) {
  console.log('Elapsed 1', Date.now() - start);
  console.log('Score:', score);

  cache('http://paulgraham.com/twitter.html', function (err, score) {
    console.log('Elapsed 3', Date.now() - start);
    console.log('Score:', score);

  });
});

cache('http://paulgraham.com/twitter.html', function (err, score) {
  console.log('Elapsed 2', Date.now() - start);
  console.log('Score:', score);

});