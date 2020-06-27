var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});


router.get('/desconectar', function (req, res, next) {
	(res.app.get("opcuaClient")).desconectar();
	res.send("Desconectando el servidor opcua");
});


router.get('/conectar', function (req, res, next) {
	(res.app.get("opcuaClient")).conectar();
	res.send("Conectando el servidor opcua");
});

module.exports = router;