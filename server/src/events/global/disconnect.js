module.exports = ({ sockets, socket }) => {
  if (socket.player && sockets[socket.player.id]) {
    delete sockets[socket.player.id]
    return console.log(`Good bye socket ${socket.player.id}`)
  }

  return console.log('Client disconnected')
}
