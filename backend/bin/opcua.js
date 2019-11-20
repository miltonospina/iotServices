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


OPCUA.crearCliente = async () => {
	OPCUA.client = await OPCUAClient.create(options);
}

OPCUA.conectar = async (endpoint) => {
	await OPCUA.client.connect(endpoint);
}

OPCUA.crearSesion = async () => {
	OPCUA.session = await client.createSession();
}

OPCUA.cerrarSesion =async () => {
	await OPCUA.session.close();
}

OPCUA.desconectar = async () => {	
	await OPCUA.client.disconnect();
}


OPCUA.leerVariable= async (node) => {
	return await OPCUA.session.read({nodeId: node});
	await new Promise((resolve) => setTimeout(resolve, 10));
}


OPCUA.escribirVariable= async (node, valor) => {
	return await session.writeSingleNode(node,{value:valor, dataType:10});
	await new Promise((resolve) => setTimeout(resolve, 10));
}

OPCUA.agregarSubscripcion = async() => {

}


OPCUA.removerSubscripcion = async() => {

}

module.exports = OPCUA;