let OPCUA = Array();

const {
	OPCUAClient,
	resolveNodeId,
	AttributeIds,
	ClientMonitoredItemGroup,
	TimestampsToReturn
} = require("node-opcua-client");

OPCUA.client = OPCUAClient;
OPCUA.resolveNodeId = resolveNodeId;
OPCUA.AttributeIds = AttributeIds;
OPCUA.ClientMonitoredItemGroup = ClientMonitoredItemGroup;
OPCUA.TimestampsToReturn = TimestampsToReturn;


OPCUA.variablesMonitoreadas = Array();
OPCUA.opciones = { endpoint_must_exist: false };
OPCUA.subsParams = {
	requestedPublishingInterval: 1000,
	requestedMaxKeepAliveCount: 10,
	requestedLifetimeCount: 6000,
	maxNotificationsPerPublish: 1000,
	publishingEnabled: true,
	priority: 10
};
OPCUA.monitorParams = {
	samplingInterval: 100,
	discardOldest: true,
	queueSize: 100
};
OPCUA.conexionEstablecida = true;
OPCUA.sesionEstablecida = true;




OPCUA.conectar = async (endpoint) => {
	try {
		//Crear objeto cliente.
		OPCUA.cliente = OPCUA.client.create(OPCUA.opciones);
		console.log("Cliente OPCUA Creado".green);

		//Crear conexión
		await OPCUA.cliente.connect(endpoint);
		console.log("Conectado al endpoint :".green, endpoint);

		//Crear sesión
		OPCUA.sesion = await OPCUA.cliente.createSession();
		console.log("Sesión creada".green);

		//Crear Subscripción
		OPCUA.subscripcion = await OPCUA.sesion.createSubscription2(OPCUA.subsParams);
		OPCUA.subscripcion.on("keepalive", function () {
			console.log("Subscripción: keepalive");
		}).on("terminated", function () {
			console.log(" Susbsripción finalizada")
		});
		console.log("Objeto de subsripción creado".green);
	}
	catch (err) {
		console.error("OCPUA.conectar ERROR: ", err);
	}
}





OPCUA.desconectar = async () => {
	try {
		//Cerrar Sesión
		await OPCUA.sesion.close();
		console.log("Sesión OPCUA Cerrada".green);

		//Cerrar conexión
		await OPCUA.cliente.disconnect();
		console.log("Cliente OPCUA desconectado".green);

	}
	catch (err) {
		console.log("OCPUA.cerrarSesion ERROR: ".red, err);
	}
}




OPCUA.leerVariable = async (nodo, callback) => {
	try {
		let resultado = await OPCUA.sesion.read(nodo);
		callback(resultado);
	}
	catch (err) {
		console.log("OCPUA.leerVariable ERROR: ", err);
	}
}




OPCUA.escribirVariable = async (nodo, valor, callback) => {
	try {
		var resultado = await sesion.writeSingleNode(node, { value: valor, dataType: 10 });
		callback(resultado);
	}
	catch (err) {
		console.log("OCPUA.escribirVariable ERROR: ", err);
	}
}




const agregarSubscripcionP = (variable, fxMonitoreo) => {
	return new Promise(async (resolve, reject) => {
		try {

			if ((OPCUA.listaVariablesMonitoreadas()).includes(variable)) {
				reject("La variable ya está siendo monitoreada")
				return
			}
			let itemToMonitor = { nodeId: variable, attributeId: OPCUA.AttributeIds.Value }

			OPCUA.subscripcion.monitor(itemToMonitor,
				OPCUA.monitorParams,
				OPCUA.TimestampsToReturn.Both,
				(err, monitoredItem) => {
					if (err) {
						console.log("cannot create monitored item", err.message);
						reject(err.message)
						return;
					}
					monitoredItem.on("changed", (dataValue) => {
						fxMonitoreo({ variable: variable, valor: dataValue.value.value.toString() })
					});
					monitoredItem.variable = variable
					OPCUA.variablesMonitoreadas.push(monitoredItem);
					resolve(variable)
				});
		} catch (error) {
			reject(error.message)
		}
	})
}


OPCUA.agregarSubscripcionM = (variables, fxMonitoreo) => {
	//Mapea el array de variables a un array de promesas
	let listadoPromersas = variables.map(
		(variable) => {
			return agregarSubscripcionP(variable, fxMonitoreo)
		});
	return Promise.allSettled(listadoPromersas)
}


OPCUA.listaVariablesMonitoreadas = () => {
	const lista = OPCUA.variablesMonitoreadas.map(
		(item) => {
			return item.variable
		})
	return lista
}

const removerSubscripcionP = (variable) => {
	return new Promise((resolve, reject) => {
		try {
			let indice = -1
			OPCUA.listaVariablesMonitoreadas().forEach((entry, i) => {
				if (entry == variable) {
					indice = i
				}
			});
			if (indice < 0) {
				reject("La variable no está siendo monitoreada")
				return
			}
			OPCUA.variablesMonitoreadas[indice].terminate((x) => {
				OPCUA.variablesMonitoreadas.splice(indice, 1);
				resolve(`Eliminada la posición ${indice} de la lista de monitoreo `, x)
			})

		} catch (error) {
			console.error(error)
			reject(error.message)
		}
	})
}


OPCUA.removerSubscripcionM = (variables, fxMonitoreo) => {
	//Mapea el array de variables a un array de promesas
	let listadoPromersas = variables.map(
		(variable) => {
			return removerSubscripcionP(variable, fxMonitoreo)
		});
	return Promise.allSettled(listadoPromersas)
}


module.exports = OPCUA;