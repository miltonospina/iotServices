const sequelize = require("../services/sequalize");
const Muestreador = sequelize.define('muestreadores', {
    id: {type: Sequelize.BIGINT, primaryKey: true},
    nombre: Sequelize.STRING,
    variableWinCC: Sequelize.STRING
})

module.exports = Muestreador;