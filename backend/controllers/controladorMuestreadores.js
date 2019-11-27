let muestradores= Array();

muestradores.crear =(muestreador,callback)=>{

	respuesta= "ok, creado exitosamente";
	error="Imposible crear"
	//callback(respuesta,);
	callback(null,error);

	//insertarlo en la base de datos
	//modificar los valores t0 y t1 con opcUA


}


muestradores.editar =(muestreador,callback)=>{

}


muestradores.eliminar =(muestreador,callback)=>{

}


muestradores.lista =(muestreador,callback)=>{

}



module.exports = muestradores;