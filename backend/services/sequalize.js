const Sequelize = require('sequelize');

const sequelize = new Sequelize('labservices', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
})



sequelize.authenticate()
.then(() => {
    console.log('Conectado a la base de datos')
})
.catch(err => {
    console.log('No se conecto a la base de datos')
})

module.exports = sequelize;