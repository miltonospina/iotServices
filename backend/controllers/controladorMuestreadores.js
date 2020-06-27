let muestradores = Object();
const modeloMuestradores = require('../models/muestreadores');


muestradores.crear =(muestreador,callback)=>{	
}


muestradores.editar =(muestreador,callback)=>{

}

muestradores.eliminar =(muestreador,callback)=>{

}


muestradores.lista = async (codMuestreador,clienteOpcua)=>{
	if (codMuestreador){
		resultado = await modeloMuestradores.findOne({where:{id:codMuestreador}});
		resultado.valorActual = await clienteOpcua.leerVariable(resultado.variableWincc+".TIME_0")
		return resultado;
	}
	else{
		resultado = await modeloMuestradores.findAll();
		resultado.array.forEach(element => {
			resultado[index].valorActual= await clienteOpcua.leerVariable(resultado.variableWincc+"TIME_0")
		});
	}
}


module.exports = muestradores;