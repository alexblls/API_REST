const Sequelize = require('sequelize');

const sequelize = new Sequelize('biometria_medio_ambiente', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

module.exports = {
  sequelize,
};
