
var cache = require('../');

var start = Date.now();

cache('5771779', function (err, score) {
  console.log('Elapsed 1', Date.now() - start);
  console.log('Score:', score);

  cache('5771779', function (err, score) {
    console.log('Elapsed 3', Date.now() - start);
    console.log('Score:', score);

  });
});

cache('5771779', function (err, score) {
  console.log('Elapsed 2', Date.now() - start);
  console.log('Score:', score);

});