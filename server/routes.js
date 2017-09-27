const express = require('express');
const router = require('express').Router();
const cloudinary = require('cloudinary')
const config = require('./.config.js')
const Image = require('./db/models/imageModel.js')
const Transaction = require('./db/models/transactionModel.js')
const db = require('./db/db.js')


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
  Transaction.create({
    trading_with_id: req.body.tradingWithID,
    trading_for_id: req.body.tradingForID,
    open: true,
    accepted: null
  })
  .then((response) => {
    res.send(response)
  })
})

router.get('/transactions', (req,res) => {
  db.query(`select
              t.id as tid,
              i.description as giveItem,
              i.username as initiator,
              i2.description as getItem,
              i2.username as receiver,
              t.open,
              t.accepted
            from transactions t
            join images i on i.id = t.trading_with_id
            join images i2 on i2.id = t.trading_for_id
            where (i.username = :username or i2.username = :username)
            order by t.open`
          , {replacements: {username: req.query.username},
             type: db.QueryTypes.SELECT})
          .then((result) => res.send(result))
          .catch((err) => console.error(err))
})

module.exports = router;
