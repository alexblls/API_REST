const Sequelize = require('sequelize');
const sequelize = require('./db.js');

const Dato = sequelize.define('dato', {
  contenido: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Dato;
