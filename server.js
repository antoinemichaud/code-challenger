var express = require('express');
var browserify = require('browserify-middleware');
var lessMiddleware = require('less-middleware');

var app = express();

var packages = ['jquery', 'react', 'lodash', 'flux'];

app.get('/js/lib.js', browserify(packages, {
  cache: true,
  precompile: true
}));

app.get('/js/bundle.js', browserify('./scripts/app.jsx', {
  external: packages,
  transform: [[
    "reactify",
    {
      "es6": true,
      "strip-types": true
    }
  ]]
}));

app.get('/scores', function (req, res) {
});


app.use(lessMiddleware(__dirname + '/'));
app.use(express.static(__dirname + '/'));

console.log("Please open http://localhost:3000/index.html");
app.listen(process.env.PORT || 3000);