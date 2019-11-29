let muestradores= Array();
var db = require('../services/db.mssql');

muestradores.crear =(muestreador,callback)=>{	
}


muestradores.editar =(muestreador,callback)=>{

}

muestradores.eliminar =(muestreador,callback)=>{

}


muestradores.lista =(codMuestreador,clienteOpcua,callback)=>{

	if(codMuestreador==null)
	{
		db.consulta("select * from labservices.dbo.muestreadores",async (resultado,error)=>{
			if(error){
				callback(null,error);
			}
			else{
				await resultado.recordset.forEach((item,index)=>{					
					clienteOpcua.leerVariable({nodeId:resultado.recordset[index].variableWinCC+".TIME_0"},(resultadoOpcua)=>{
					resultado.recordset[index].valor= resultadoOpcua.value.value;
					console.log(resultado.recordset[index].valor)
					})
				})

				
				callback(resultado.recordset,null);
			}
		});
	}
	else{
		db.consulta("select * from labservices.dbo.muestreadores where id = "+codMuestreador,callback);	
	}
}



module.exports = muestradores;