"use strict";

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

var config = require('config');
var log = require('libs/log')(module);

var app = express();
var router = express.Router();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

router.get('/', function(request, response, next) {
  response.render('index');
});

app.use(function(request, response, next) {
  var error = new Error('Page not found');
  error.status = 404;
  log.error(request.url, ' not found');
  next(error);
});

app.use(function(error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = error;
  response.status(error.status || 500);
  response.render('error');
});

if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  log.error('Node modules is not installed. Please run the command:\nnpm install');
  process.exit(0);
}

http.createServer(app).listen(config.get('server:port'), function() {
  log.info('Ok, ', config.get('server:port'));
});
