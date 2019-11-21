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


OPCUA.variablesMonitoreadas = Array();
OPCUA.opciones ={endpoint_must_exist: false};
OPCUA.subsParams = {
    requestedPublishingInterval: 2000,
    requestedMaxKeepAliveCount: 20,
    requestedLifetimeCount: 6000,
    maxNotificationsPerPublish: 1000,
    publishingEnabled: true,
    priority: 10
};
OPCUA.monitorParams ={
	samplingInterval: 100,
	discardOldest: true,
	queueSize: 100
};
OPCUA.conexionEstablecida = true;
OPCUA.sesionEstablecida = true;




OPCUA.conectar = async (endpoint) => {
	try{
		//Crear objeto cliente.
		OPCUA.cliente = OPCUA.client.create(OPCUA.opciones);
		console.log("Cliente OPCUA Creado".green);

		//Crear conexión
		await OPCUA.cliente.connect(endpoint);
		console.log("Conectado al endpoint :".green,endpoint);

		//Crear sesión
		OPCUA.sesion = await OPCUA.cliente.createSession();
		console.log("Sesión creada".green);

		//Crear Subscripción
		OPCUA.subscripcion= await OPCUA.sesion.createSubscription2(OPCUA.subsParams);
		OPCUA.subscripcion.on("keepalive", function () {
            console.log("Subscripción: keepalive");
        }).on("terminated", function () {
            console.log(" Susbsripción finalizada")
        });
        console.log("Objeto de subsripción creado".green);
	}
	catch(err){
		console.log("OCPUA.conectar ERROR: ",err);
	}
}



OPCUA.desconectar =async () => {
	try{
		//Cerrar Sesión
		await OPCUA.sesion.close();
		console.log("Sesión OPCUA Cerrada".green);

		//Cerrar conexión
		await OPCUA.cliente.disconnect();
		console.log("Cliente OPCUA desconectado".green);
		
	}
	catch(err){
		console.log("OCPUA.cerrarSesion ERROR: ".red,err);
	}
}




OPCUA.leerVariable= async (nodo,callback) => {
	try{
		let resultado= await OPCUA.sesion.read(nodo);
		callback(resultado);
	}
	catch(err){
		console.log("OCPUA.leerVariable ERROR: ",err);
	}
	
}




OPCUA.escribirVariable= async (nodo, valor,callback) => {
	try{
		var resultado= await sesion.writeSingleNode(node,{value:valor, dataType:10});
		callback(resultado);
	}
	catch(err)
	{
		console.log("OCPUA.escribirVariable ERROR: ",err);
	}
}




OPCUA.agregarSubscripcion = async(variables,fxMonitoreo,callback) => {	
	
	//para cada una de las variables a suscribir...
	for (let i = 0; i < variables.length; i++) {

		var variableMonitoreada =Array();
		const estaVariable = variables[i];
		//Evalua si la variable ya se encuentra en monitoreo	
		if(typeof (OPCUA.variablesMonitoreadas.find(item =>item.nodeId== estaVariable.nodeId)) === "undefined"){

			//agrega la variable al monitoreo

			try{
				variableMonitoreada = await OPCUA.subscripcion.monitor(estaVariable, OPCUA.monitorParams, TimestampsToReturn.Both);

				//agrega la función que se ejecutará cuando la variable monitoreada cambie
	        	variableMonitoreada.on("changed", (dataValue) => { fxMonitoreo(dataValue.value.toString())});
			}
			catch(err){
				console.log(err);
			}

	        //consulta la variable por primera vez; si la variable es lenta el primer dato no se ve
			OPCUA.leerVariable(estaVariable,fxMonitoreo);

			//agrega la variable al array de variables monitoreadas
			OPCUA.variablesMonitoreadas.push(variableMonitoreada);

			console.log("Agregando al monitoreo: ",estaVariable.nodeId.value);

			//ejecuta la función callback entregando la lista de monitoreo limpia
			callback(limpiarArray(OPCUA.variablesMonitoreadas));

		}
		else
		{
			console.log("La variable ya está suscrita: ".yellow + estaVariable.nodeId );
		}

		//callback()

	}

}




OPCUA.removerSubscripcion = async(variables) => {
}




function limpiarArray(ar){
	const respuesta = ar;
	for (let i = 0; i < respuesta.length; i++) {
		try{
			delete respuesta[i].monitoredItem;
			delete respuesta[i].attributeId;
		}
		catch(err)
		{
			console.log(err);
		}
	}
	return respuesta;
}


module.exports = OPCUA;