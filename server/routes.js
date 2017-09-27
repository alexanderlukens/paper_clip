const express = require('express');
const router = require('express').Router();
const cloudinary = require('cloudinary')
const config = require('./.config.js')
const Image = require('./db/models/imageModel.js')
const Transaction = require('./db/models/transactionModel.js')



router.get('/picture', (req, res) => {
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

router.post('/picture', (req, res) => {
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

router.post('/transactions', (req,res) => {
  let tradingWithUser = '';
  let tradingForUser = '';
  findImageUser(req.body.tradingWithID)
  .then((result) => {
    tradingWithUser = result.username
    return;
  })
  .then(() => {
    findImageUser(req.body.tradingForID)
    .then((result) => {
      tradingForUser = result.username
      return
    })
    .then(() => {
      Transaction.create({
        tradingWithID: req.body.tradingWithID,
        tradingWithUser: tradingWithUser,
        tradingForID: req.body.tradingForID,
        tradingForUser: tradingForUser,
        open: true,
        accepted: null
      })
      .then((response) => {
        res.send(response)
      })
    })
  })
})

findImageUser = (id) => {
  return Image.find({
    attributes: ['username'],
    where: {
      id: id
    }
  })
}


module.exports = router;
