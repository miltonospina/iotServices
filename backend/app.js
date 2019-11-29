var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var muestreadoresRouter = require('./routes/muestreadores');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(config.apiVersion+'/', indexRouter);
app.use(config.apiVersion+'/users', usersRouter);
app.use(config.apiVersion+'/muestreadores',muestreadoresRouter)



module.exports = app;
