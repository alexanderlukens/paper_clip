const config = require('../.config.js')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(config.dbConfig.database, config.dbConfig.user, config.dbConfig.password, {
  host: config.dbConfig.host,
  port: config.dbConfig.post,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
})

sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = sequelize;
