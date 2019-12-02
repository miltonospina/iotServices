let OPCUA = Object();

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
    requestedPublishingInterval: 1000,
    requestedMaxKeepAliveCount: 10,
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



OPCUA.desconectar = async () => {
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




OPCUA.leerVariable = async(nodo) => {
	var resultado = await OPCUA.sesion.read({nodeId:nodo});
	return resultado.value.value;
}



OPCUA.escribirVariable= async (nodo, valor) => {
	var resultado = await sesion.writeSingleNode({"node":nodo},{value:valor, dataType:10});
	return resultado;
}



OPCUA.agregarSubscripcion = (variable,fxMonitoreo,callback) => {
	try {
		OPCUA.subscripcion.monitor(
			{nodeId: variable, attributeId: 13},
			OPCUA.monitorParams,
			TimestampsToReturn.Both,
			(err,monitoredItem)=>{
				if (err) {
					console.log("cannot create monitored item", err.message);
					callback(null,err);
					return;
				}
				OPCUA.variablesMonitoreadas.push({nombre:variable,item:monitoredItem});
				delete monitoredItem;
				largo= OPCUA.variablesMonitoreadas.length-1;

				OPCUA.variablesMonitoreadas[largo].item.on("changed", (DataValue) => {
					fxMonitoreo(variable,DataValue.value.value);
				});
				OPCUA.variablesMonitoreadas[largo].item.on("initialized", (DataValue) => {
					fxMonitoreo(variable,DataValue.value.value);
				});


				callback(Date.now()+": Agregando al monitoreo: "+variable);
				//callback(Date.now()+": Agregando al monitoreo: "+OPCUA.variablesMonitoreadas[largo]);
			});
	}
	catch(err) {
		console.log("catch err: ",err);
		callback(null,err);
	}
}






OPCUA.removerSubscripcion = async(variable,callback) => {
	try{
		OPCUA.variablesMonitoreadas.forEach((entry, i) => {
			
		});

		aEliminar = OPCUA.variablesMonitoreadas.filter((item)=>{return item.nombre!=  variable});
		aEliminar.terminate(()=>{
			OPCUA.variablesMonitoreadas= OPCUA.variablesMonitoreadas.filter((item)=>{return item.nombre!=  variable});
			aEliminar=null;
			callback("Variable eliminada de la subsripción:"+variable);

		});
		
	}catch(err)
	{
		callback(null,err);
	}
}





module.exports = OPCUA;