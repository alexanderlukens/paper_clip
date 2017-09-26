const db = require('../db.js')
const Sequelize = require('sequelize')

const Image = db.define('image', {
  url: Sequelize.STRING,
  username: Sequelize.STRING,
  description: Sequelize.STRING,
  traded: Sequelize.STRING
})

Image.sync()

module.exports = Image
