const express = require('express')
const parser = require('body-parser')
const cloudinary = require('cloudinary')
const config = require('./.config.js')
const Image = require('./db/models/imageModel.js')
const app = express()



app.use(parser.json({limit: '50mb'}))
app.use(express.static(__dirname + '/../client/dist'));

app.get('/picture', (req, res) => {
  Image.findAll({
    where: {
      userId: req.query.userId,
      traded: null
    }
  })
  .then((result) => {
    res.send(result)
  })
})

app.post('/picture', (req, res) => {
  let form_data = req.body.data
  cloudinary.config(config.cloudinaryConfig)
  cloudinary.v2.uploader.upload(form_data, function(err, result) {
    if (err) {
      console.error(err)
      return
    }
    Image.create({
      url: result.url,
      userId: 1
    })
    res.send(result.url)
  })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
