const db = require('../db.js')
const Sequelize = require('sequelize')

const Image = db.define('image', {
  url: Sequelize.STRING,
  userId: Sequelize.INTEGER,
  traded: Sequelize.STRING
})

Image.sync()

module.exports = Image
