const express = require('express')
const parser = require('body-parser')
const router = require('./routes.js')
const socket = require('socket.io')
const app = express()


app.use(parser.json({limit: '50mb'}))
app.use(express.static(__dirname + '/../client/dist'));
app.use('/', router);


const server = app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

const io = socket(server);

io.on('connection', (socket) => {
  console.log('made connectin socket', socket.id )

  socket.on('reject', (data) => {
    io.sockets.emit('reject',data)
  })

  socket.on('offer', (data) => {
    io.sockets.emit('offer',data)
  })

  socket.on('accept', (data) => {
    io.sockets.emit('accept',data)
  })
})
