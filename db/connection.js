const { Model } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/app.db'
});

// Exportar o arquivo de configuração de banco para o arquivo principal
module.exports = sequelize;
// a variável sequelize será exportada como módulo