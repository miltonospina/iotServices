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




OPCUA.crearCliente = async () => {
	try{
		OPCUA.client = await OPCUAClient.create(OPCUA.options);
	}
	catch(e){
		console.log(e);
	}
	console.log("Cliente OPCUA creado");
}



OPCUA.conectar = async (endpoint) => {
	try{		
		await OPCUA.client.connect(endpoint);
	}
	catch(e){
		console.log(e);
	}
	console.log("Conectado al endpoint: ", endpoint)
}



OPCUA.crearSesion = async () => {
	try{
		OPCUA.session = await OPCUA.client.createSession();
	}
	catch(e){
		console.log(e);		
	}
	console.log("Sesion OPCUA Creada");
}



OPCUA.cerrarSesion =async () => {
	try{
		await OPCUA.session.close();
	}
	catch(e){
		console.log(e);		
	}
	console.log("Sesion OPCUA Cerrada");
	
}



OPCUA.desconectar = async () => {
	try{
		await OPCUA.client.disconnect();
	}
	catch(e){
		console.log(e);		
	}
	console.log("Desconectando del endpoint OPCUA");
	
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