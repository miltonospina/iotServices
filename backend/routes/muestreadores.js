var express = require('express');
var router = express.Router();

var controladorMuestreadores = require("../controllers/controladorMuestreadores");


router.get('/:id*?', function(req, res, next) {
	codMuestreador=req.params.id;
	console.log(req.params);
	controladorMuestreadores.lista(codMuestreador,res.app.get("opcuaClient"),
	(respuesta,error)=>{
		if(error){
			res.status(500).send(error);
		}
		else{
			res.send(respuesta);
		}
	});
});


router.put('/:id*?', function(req, res, next) {
	/*codMuestreador=req.params.id;
	console.log(req.params);
	controladorMuestreadores.lista(codMuestreador,
	(respuesta,error)=>{
		if(error){
			res.status(500).send(error);
		}
		else{
			res.send(respuesta);
		}
	}); */
});


module.exports = router;
