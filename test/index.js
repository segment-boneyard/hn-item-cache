var cache = require('../');
var start = Date.now();

cache('http://paulgraham.com/twitter.html', function (err, item) {
  console.log('Elapsed 1', Date.now() - start);
  console.log('ID:', item.id);
  console.log('Points:', item.points);

  cache('http://paulgraham.com/twitter.html', function (err, item) {
    console.log('Elapsed 3', Date.now() - start);
    console.log('ID:', item.id);
    console.log('Points:', item.points);
  });
});

cache('http://paulgraham.com/twitter.html', function (err, item) {
  console.log('Elapsed 2', Date.now() - start);
  console.log('ID:', item.id);
  console.log('Points:', item.points);
});