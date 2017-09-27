const db = require('../db.js')
const Sequelize = require('sequelize')

const Transaction = db.define('transaction', {
  tradingWithID: Sequelize.INTEGER,
  tradingForID: Sequelize.INTEGER,
  open: Sequelize.STRING,
  accepted: Sequelize.STRING
})

Transaction.sync()

module.exports = Transaction
