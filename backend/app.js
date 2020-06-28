const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const monitoringRouter = require('./routes/monitoring');

const config = require('./config');
//const muestreadoresRouter = require('./routes/muestreadores')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(config.webServer.apiVersion+'/', indexRouter);
app.use(config.webServer.apiVersion+'/monitoring', monitoringRouter)
//app.use(config.apiVersion+'/muestreadores',muestreadoresRouter)
module.exports = app;
