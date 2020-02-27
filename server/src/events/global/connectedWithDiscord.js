const axios = require('axios')

module.exports = async ({ sockets, socket, data, assets }, dataReceived) => {
  const identity = await axios
    .get(
      'https://discordapp.com/api/users/@me',
      { headers: { Authorization: `Bearer ${dataReceived.token}` } }
    )

  // if the sessionID received does not correspond the session id in userIDs, we destroy the player's identity
  if (data.userIDs.get(identity.data.id) && data.userIDs.get(identity.data.id) !== dataReceived.sessionID) {
    data.userIDs.delete(data.userIDs.get(identity.data.id))
    data.userIDs.delete(identity.data.id)
  }

  // if there is no player identity in userIDs, we create one and we recreate the sessionID
  if (!data.userIDs.get(identity.data.id)) {
    const newSessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    socket.emit('newSessionID', { sessionID: newSessionID })
    data.userIDs.set(identity.data.id, newSessionID)
    data.userIDs.set(newSessionID, identity.data)
  }

  // now we simply do the same thing as in the sessionIDCookie script
  // retrieve the userID given by the sessionID in the userIDs database
  const userID = data.userIDs.get(dataReceived.sessionID)

  // if the user was in the database we will give him informations otherwise we wont do anything because it is not a valid sessionCookie
  if (userID) {
    // add the new socket into the sockets object with key userID
    sockets[userID] = socket

    // add the player object to the socket
    socket.player = new assets.Player(userID, data)

    // grant the access to the client
    socket.emit('authed', socket.player.identity)

    // send all the user infos to the client on new connection, if first connexion, create the player in game database
    if (!socket.player.userInfos) socket.player.createUserInGameDB()
    socket.emit('userInfos', socket.player.userInfos)

    // send the user settings to the client on new connection
    const userSettings = { type: 'settings', data: socket.player.settings }
    socket.emit('userInfos', userSettings)
  }
}
