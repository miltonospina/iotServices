var express = require('express');
var router = express.Router();

var controladorMuestreadores = require("../controllers/controladorMuestreadores");

/* GET users listing. */
router.get('/', function(req, res, next) {

	var nuevo= {nombre:"nuevo muestreador", variableWinCC: "un nombre largo"};

	controladorMuestreadores.crear(nuevo,
	(respuesta,error)=>{
		if(error){
			res.status(500).send(error);
		}
		else{
			res.send(respuesta);
		}
	});

});

module.exports = router;
