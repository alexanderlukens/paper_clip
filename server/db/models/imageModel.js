const db = require('../db.js')
const Sequelize = require('sequelize')

const Image = db.define('image', {
  url: Sequelize.STRING,
  userId: Sequelize.INTEGER
})

Image.sync()

module.exports = Image
