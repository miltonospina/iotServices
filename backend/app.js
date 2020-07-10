/**
 * Dependencias express. como lo genera exporess generator
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Limpiar pantalla y habilitar colores
 */
const colors = require('colors');
const clear = require('clear-screen')
clear()


/**
 * Dependencias del proyecto
 */
 const OPCUA_CLIENT = require('./services/opcuaClient');
 const SOCKETIO_SERVICE = require('./services/socket.io');
 const CONFIG = require('./config');
 const jwt = require('jsonwebtoken');
 const authMiddleware = require('./middlewares/auth')

 OPCUA_CLIENT.conectar(CONFIG.opcua.endpoint);

 app.set('opcuaClient', OPCUA_CLIENT);
 app.set('socket.io',SOCKETIO_SERVICE)
 app.set('config',CONFIG)
 app.set('jwt',jwt)
 app.set('jwtKey', CONFIG.webServer.jwtKey);


/**
 * Rutas
 */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var monitoringRouter = require('./routes/monitoring');


app.use(CONFIG.webServer.apiVersion+'/', indexRouter);
app.use(CONFIG.webServer.apiVersion+'/auth', authRouter);
app.use(CONFIG.webServer.apiVersion+'/users', usersRouter);
app.use(CONFIG.webServer.apiVersion+'/monitoring',authMiddleware, monitoringRouter);


module.exports = app;