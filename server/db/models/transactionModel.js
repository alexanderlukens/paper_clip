const db = require('../db.js')
const Sequelize = require('sequelize')

const Transaction = db.define('transaction', {
  trading_with_id: Sequelize.INTEGER,
  trading_for_id: Sequelize.INTEGER,
  open: Sequelize.STRING,
  accepted: Sequelize.STRING
})

Transaction.sync()

module.exports = Transaction
