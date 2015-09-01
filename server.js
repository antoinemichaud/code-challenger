var express = require('express');
var browserify = require('browserify-middleware');
var lessMiddleware = require('less-middleware');
var request = require('request');
var Promise = require('bluebird');
var _ = require('lodash');

var requestAsync = Promise.promisify(request);
var getRequestAsync = Promise.promisify(request.get);

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

app.get('/scores', function (request, response) {
  requestAsync('http://localhost:8081/generateGameTest').bind(response)
    .spread(function (questionsQueryResponse, questionsQueryBody) {
      return JSON.parse(questionsQueryBody);
    })
    .map(function (question) {
      return Promise.props({
        question: question,
        candidateResult: requestAsync('http://localhost:8080/displayScore?player1Name=albert&player1Score=7&player2Name=Roger&player2Score=5')
          .spread(function (candidateResultResponse, candidateResultBody) {
            return candidateResultBody;
          }),
        referenceResult: requestAsync('http://localhost:8080/displayScore?player1Name=albert&player1Score=7&player2Name=Roger&player2Score=5')
          .spread(function (referenceResultResponse, referenceResultBody) {
            return referenceResultBody;
          })
      });
    })
    .then(function (results) {
      return this.send(results);
    })
  ;
});

app.get('/httpsuccess', function (req, res) {
  res.send('success !')
});

app.use(lessMiddleware(__dirname + '/'));
app.use(express.static(__dirname + '/'));

console.log("Please open http://localhost:3000/index.html");
app.listen(process.env.PORT || 3000);