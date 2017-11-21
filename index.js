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

router.get('/', function(req, res, next) {
  res.render('index');
});

app.use(function(req, res, next) {
  var err = new Error('Page not found');
  err.status = 404;
  log.error(req.url, ' not found');
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error');
});

if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  log.error('Node modules is not installed. Please run the command:\nnpm install');
  process.exit(0);
}

http.createServer(app).listen(config.get('server:port'), function() {
  log.info('Ok, ', config.get('server:port'));
});
