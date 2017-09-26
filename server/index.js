const express = require('express')
const parser = require('body-parser')
const cloudinary = require('cloudinary')
const config = require('./.config.js')
const Image = require('./db/models/imageModel.js')
const app = express()



app.use(parser.json({limit: '50mb'}))
app.use(express.static(__dirname + '/../client/dist'));

app.get('/picture', (req, res) => {
  let where;
  if (req.query.marketplace){
    where = {
      username : {
        $ne: req.query.username
      },
      traded: null
    }
  } else {
    where = {
      username: req.query.username,
      traded: null
    }
  }
  Image.findAll({
    attributes: ['url', 'description', 'id'],
    where: where
  })
  .then((result) => {
    result = result.map((item) => [item.url, item.description, item.id])
    res.send(result)
  })
})

app.post('/picture', (req, res) => {
  let form_data = req.body.data
  let username = req.body.username
  let description = req.body.description
  cloudinary.config(config.cloudinaryConfig)
  cloudinary.v2.uploader.upload(form_data, function(err, result) {
    if (err) {
      console.error(err)
      return
    }
    Image.create({
      url: result.url,
      username: username,
      description: description
    })
    .then((data) => {
      result.id = data.id
      result.description = description
      res.send(result)
    })
  })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
