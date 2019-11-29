const sql = require('mssql');
var config = require('../config');

var db = Object();

db.consulta= async (consulta,callback)=>{
	err= null;
	resultado= null;
	try{
		await sql.connect(config.db);
		const result = await sql.query(consulta);
		const resultado =result;
		callback(resultado,err);
	}
	catch(err){
		callback(resultado,err);
	}
}

module.exports = db;