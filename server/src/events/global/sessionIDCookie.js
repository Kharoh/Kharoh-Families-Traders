module.exports = ({ socket, sockets, data, assets }, sessionCookie) => {
  // retrieve the userID given by the sessionID in the userIDs database
  const userID = data.userIDs.get(sessionCookie)

  // if the user was in the database we will give him informations otherwise we wont do anything because it is not a valid sessionCookie
  if (userID) {
    // add the new socket into the sockets object with key userID
    sockets[userID.id] = socket

    // add the player object to the socket
    socket.player = new assets.Player(userID, data)

    // grant the access to the client
    socket.emit('authed', userID)

    // send all the user infos to the client on new connection, if first connexion, create the player in game database
    if (!socket.player.userInfos) socket.player.createUserInGameDB()
    socket.emit('userInfos', socket.player.userInfos)

    // send the user settings to the client on new connection
    const userSettings = { type: 'settings', data: socket.player.settings }
    socket.emit('userInfos', userSettings)
  }
}
