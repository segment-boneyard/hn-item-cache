var cache = require('../');
var start = Date.now();

var url = 'http://www.hn-button.com/';


cache(url, function (err, item) {
  console.log('Elapsed 1', Date.now() - start);
  console.log('ID:', item.id);
  console.log('Points:', item.points);

  cache(url, function (err, item) {
    console.log('Elapsed 3', Date.now() - start);
    console.log('ID:', item.id);
    console.log('Points:', item.points);
  });
});

cache(url, function (err, item) {
  console.log('Elapsed 2', Date.now() - start);
  console.log('ID:', item.id);
  console.log('Points:', item.points);
});



setTimeout(function () {

  start = Date.now();

  cache(url, function (err, item) {
    console.log('Elapsed 4', Date.now() - start);
    console.log('ID:', item.id);
    console.log('Points:', item.points);
  });



}, 15000);