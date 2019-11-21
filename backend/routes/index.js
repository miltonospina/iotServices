var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/desconectar', function(req,res,next){
	(res.app.get("opcuaClient")).desconectar();
	res.send("Desconectando el servidor opcua");
});


router.get('/monitorear', function(req,res,next){

	var variables= Array();
	variables.push({nodeId:"ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/PV_ELLIOT.SI"});
	variables.push({nodeId:"ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/ENER.L_Cerrito_P"});

	(res.app.get("opcuaClient")).agregarSubscripcion(variables,
		function(r){console.log("monitoreo:",r.value.value)},
		function(cb){console.log(cb.subscription)}
		);
	//res.send("Agregado al monitoreo");
});
module.exports = router;
