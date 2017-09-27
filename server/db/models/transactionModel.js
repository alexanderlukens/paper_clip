const db = require('../db.js')
const Sequelize = require('sequelize')

const Transaction = db.define('transaction', {
  tradingWithID: Sequelize.INTEGER,
  tradingWithUser: Sequelize.STRING,
  tradingForID: Sequelize.INTEGER,
  tradingForUser: Sequelize.STRING,
  open: Sequelize.STRING,
  accepted: Sequelize.STRING
})

Transaction.sync()

module.exports = Transaction
