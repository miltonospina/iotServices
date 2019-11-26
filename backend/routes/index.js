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
	//"ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/PV_ELLIOT.SI"
	//"ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/ENER.L_Cerrito_P"

	(res.app.get("opcuaClient")).agregarSubscripcion2("ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/ENER.CALC_ESCAPE_CABEZAL",
	function(nombre,valor){
		console.log("monitoreo:[",nombre,"]: ",valor)
	},
	function(cb,err){
		if(err){
			console.log(err);
			res.status(500).send("Imposible agregar al monitoreo: "+ err.message);
		}else{
			console.log(cb);
			res.send(cb);
		}
	});
});


router.delete('/monitorear', function(req,res,next){
	
	(res.app.get("opcuaClient")).removerSubscripcion("ns=1;s=t|SERVIDORES_SERVIDOR1::Programa_Caldera/ENER.CALC_ESCAPE_CABEZAL",
		(respuesta,error)=>{
			if(error){
				res.status(500).send("Imposible eliminar la variable monitoreada: "+ error.message);
			}
			else{
				res.send(respuesta);
			}
		})
});



module.exports = router;