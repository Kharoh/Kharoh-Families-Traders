class Player {
  constructor(playerID, data) {
    this.id = playerID.id // The discord id of the player
    this.data = data // The global database
    this.identity = playerID // The full discord identity of the player
  }

  get userInfos() {
    return this.data.game.get(`player${this.id}`)
  }

  get inventory() {
    return this.data.game.get(`player${this.id}`, 'inventory')
  }

  set inventory(newInventory) { // newInventory will have to be an object
    return this.data.game.set(`player${this.id}`, newInventory, 'inventory')
  }

  get settings() {
    return this.data.settings.ensure(this.id, {})
  }

  set settings(newSettings) {
    return this.data.settings.set(this.id, newSettings)
  }

  createUserInGameDB() {
    const newUser = {
      inventory: { // The object which will contain the user's inventory e.g. items
        stone: 1
      },
    }

    this.data.game.set(`player${this.id}`, newUser)
  }

}

module.exports = Player
