const db = require('../db.js')
const Sequelize = require('sequelize')

const Image = db.define('image', {
  url: Sequelize.STRING,
  username: Sequelize.STRING,
  description: Sequelize.STRING,
  traded: Sequelize.STRING,
  predecessor: Sequelize.INTEGER
})

Image.sync()

module.exports = Image
