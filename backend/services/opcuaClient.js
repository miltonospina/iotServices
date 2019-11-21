let OPCUA = Array();

const  { 
	OPCUAClient ,
	resolveNodeId, 
	AttributeIds,
	ClientMonitoredItemGroup, 
	TimestampsToReturn
} = require("node-opcua-client");

OPCUA.client = OPCUAClient;
OPCUA.resolveNodeId = resolveNodeId;
OPCUA.AttributeIds = AttributeIds;
OPCUA.ClientMonitoredItemGroup =ClientMonitoredItemGroup;
OPCUA.TimestampsToReturn =TimestampsToReturn;
OPCUA.variablesSuscritas = Array();
OPCUA.options ={endpoint_must_exist: false};


OPCUA.conexionEstablecida=true;
OPCUA.sesionEstablecida= true;


OPCUA.conectar = async (endpoint) => {
	OPCUA.cliente = await OPCUA.client.create(OPCUA.options);
	await OPCUA.cliente.connect(endpoint, function (err) {
		if (err) {
			console.log(err)
			console.log("imposible conectar con el endpoint :".red, endpoint);
			throw err;
		} else {
			console.log("Conectado al endpoint OPCUA!");
			OPCUA.conexionEstablecida=true;
		}
	});

	OPCUA.cliente.on("timed_out_request ", function () {
		console.log("timed_out_request ");
	});

	OPCUA.cliente.on("start_reconnection", function () {
		console.log("start_reconnection not working so aborting");
	});
	OPCUA.cliente.on("connection_reestablished", function () {
		console.log("connection_reestablished ");
	});
	OPCUA.cliente.on("close", function () {
		console.log("close and abort");
		opcuaServerUp = false;
	});
	OPCUA.cliente.on("backoff", function (nb, delay) {
		console.log("  connection failed for the", nb,
				" time ... We will retry in ", delay, " ms");
		opcuaServerUp = false;
	});
}





OPCUA.crearSesion = async () => {
	if(OPCUA.conexionEstablecida){
		OPCUA.session = await OPCUA.cliente.createSession();
		console.log("Sesion OPCUA Creada");
		}
	else{
	console.log("Imposible crear sesion, no se ha establecido la conexion al endpoint")	
	}
}



OPCUA.cerrarSesion =async () => {
	if(OPCUA.sesionEstablecida){
		await OPCUA.session.close();
		console.log("Sesion OPCUA Cerrada");
	}else{
		console.log("Imposible cerrar sesión, no existe una sesión actualmente")
	}
}



OPCUA.desconectar = async () => {
	if(OPCUA.conexionEstablecida){
		await OPCUA.cliente.disconnect();
		console.log("Desconectando del endpoint OPCUA");1
	}
	else{
		console.log("No existe conexion actualmente")
	}
	
	
}


OPCUA.leerVariable= async (nodo) => {
	return await OPCUA.session.read({nodeId: node});
	await new Promise((resolve) => setTimeout(resolve, 10));
}


OPCUA.escribirVariable= async (nodo, valor) => {
	return await session.writeSingleNode(node,{value:valor, dataType:10});
	await new Promise((resolve) => setTimeout(resolve, 10));
}

OPCUA.agregarSubscripcion = async(nodo) => {
	
}


OPCUA.removerSubscripcion = async(nodo) => {

}

module.exports = OPCUA;