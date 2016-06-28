var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var API        = require('./lib/API').API;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var a = new API();

app.use('/', a.getRouter());
app.listen(port);
console.log('Magic happens on port ' + port);
