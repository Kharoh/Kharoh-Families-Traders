const express = require('express')
const http = require('http')
const fs = require('fs')
const socketIo = require('socket.io')
const Enmap = require('enmap')
const assets = require('./src/assets/assets')

const sockets = {}
const data = {
  userIDs: new Enmap({ name: 'userIDs' }),
  game: new Enmap({ name: 'game' }),
  settings: new Enmap({ name: 'settings' })
}

const port = process.env.PORT || 4001
const index = require('./routes/index')

const app = express()
app.use(index)

const server = http.createServer(app)
const io = socketIo(server)

// Event handler loader
const eventTypes = ['global', 'game']
const events = []
eventTypes.forEach(eventType => {
  fs.readdir(`./src/events/${eventType}/`, (err, files) => {
    if (err) return console.error(err)
    files.forEach(file => {
      if (!file.endsWith('.js')) return
      const event = require(`./src/events/${eventType}/${file}`)
      const eventName = file.split('.')[0]
      events.push({ eventName, event })
      console.log(`loaded\t${eventName}`)
      delete require.cache[require.resolve(`./src/events/${eventType}/${file}`)]
    })
  })
})

// Client event handler
io.on('connection', socket => {
  console.log('New client connected')

  events.forEach(({ eventName, event }) => {
    socket.on(eventName, event.bind(null, { socket, sockets, data, assets }))
  })
})

// Resetting database on reload, can be commented
// data.userIDs.deleteAll()
// data.game.deleteAll()
// data.settings.deleteAll()

// Launching server
server.listen(port, () => console.log(`Listening on port ${port}`))
