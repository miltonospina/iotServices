var express = require('express');
var router = express.Router();


//Obtener la lista de variables monitoreadas
router.get('/', (req, res, next) => {
	const respuesta = {
		status: "OK",
		variablesMonitoreadas: (res.app.get("opcuaClient")).listaVariablesMonitoreadas()
	}
	res.send(respuesta)
})


//Agregar variables a la lista de monitoreo
router.post('/', (req, res, next) => {
	const clienteOpcUA = (res.app.get("opcuaClient"))
	const variables = req.body.variables;
	const usuario = req.decoded.usuario
	const io = res.app.get('io')
	const respuesta = {
		status: "UNK",
		variablesAgregadas: Array()
	};
	clienteOpcUA.agregarSubscripcionM(usuario, variables, (valor) => { console.log(valor); io.emit('monitoring', valor);})
		.then(
			(response) => {
				respuesta.errores = response.filter(caso => caso.status == "rejected")
				respuesta.variablesAgregadas = response.filter(caso => caso.status != "rejected")

				if (respuesta.errores.length == variables.length) {
					res.status(400).send({ ...respuesta, status: "ERR", msg: "No se pudo agregar ninguna variable al monitoreo" })
				}
				else {
					res.send({ ...respuesta, status: "OK" })
				}
			}
		)
});

//Remueve variables de la lista de monitoreo
router.delete("/", (req, res, next) => {
	const clienteOpcUA = (res.app.get("opcuaClient"))
	const variables = req.body.variables;
	const usuario = req.decoded.usuario
	const respuesta = {
		status: "UNK",
		variablesAgregadas: Array()
	};
	clienteOpcUA.removerSubscripcionM(usuario, variables).then(
		(response) => {
			respuesta.errores = response.filter(caso => caso.status == "rejected")
			respuesta.variablesAgregadas = response.filter(caso => caso.status != "rejected")

			if (respuesta.errores.length == variables.length) {
				res.status(400).send({ ...respuesta, status: "ERR", msg: "No se pudo remover niguna subsripción" })
			}
			else {
				res.send({ ...respuesta, status: "OK" })
			}
		}
	)
});


module.exports = router;
