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
      username: req.query.username
    }
  }
  Image.findAll({
    attributes: ['url', 'description', 'id', 'traded'],
    where: where
  })
  .then((result) => {
    result = result.map((item) => [item.url, item.description, item.id, item.traded])
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
              i.id as giveItemID,
              i.description as giveItem,
              i.username as initiator,
              i2.id as getItemID,
              i2.description as getItem,
              i2.username as receiver,
              t.open,
              t.accepted
            from transactions t
            join images i on i.id = t.trading_with_id
            join images i2 on i2.id = t.trading_for_id
            where (i.username = :username or i2.username = :username)
                  and coalesce(t.accepted,'') <> 'expired'
            order by t.open`
          , {replacements: {username: req.query.username},
             type: db.QueryTypes.SELECT})
          .then((result) => res.send(result))
          .catch((err) => console.error(err))
})

router.put('/transactions/reject', (req,res) => {
  db.query(`Update transactions
            set open = 'false',
                accepted = 'rejected'
            where id = ${req.body.tid}`
          , {type: db.QueryTypes.UPDATE})
  .then((result) => {
    res.send(result)
  })
})

router.put('/transactions/accept', (req,res) => {
  let items = req.body.itemid.split(',').map((num) => parseInt(num))
  db.query(`Update transactions
            set open = 'false',
                accepted = 'accepted'
            where id = ${req.body.tid}`
          , {type: db.QueryTypes.UPDATE})
  .then((result) => {
    updateAllTransaction(items, req.body.tid)
    .then(() => {
      return updateItems(items)
      .then(() => {
        createNewItems(items)
        .then(() => {
          res.send('success')
        })
      })
    })
  })
})

const updateAllTransaction = (items, tid) => {
  return db.query(`Update transactions
            set open = 'false',
              accepted = 'expired'
            where id <> ${tid} and (trading_with_id in (${items[0]}, ${items[1]}) or trading_for_id in (${items[0]}, ${items[1]}))`
          , {type: db.QueryTypes.UPDATE})
}

const updateItems = (items) => {
  return db.query(`Update images
            set traded = 'x'
            where id in (${items[0]}, ${items[1]})`
          , {type: db.QueryTypes.UPDATE})
}

const createNewItems = (items) => {
  return db.query(`select
              url,
              username,
              description
            from images
            where id in (${items[0]}, ${items[1]})`
        , {type: db.QueryTypes.SELECT})
    .then((result) => {
      let user1 = result[0].username;
      let user2 = result[1].username;
      Image.create({
        url: result[0].url,
        username: user2,
        description: result[0].description,
        predecessor: items[1]
      })
      .then(() => {
        Image.create({
          url: result[1].url,
          username: user1,
          description: result[1].description,
          predecessor: items[0]
        })
        .then((result) => {
          return
        })
      })
    })
}

module.exports = router;
