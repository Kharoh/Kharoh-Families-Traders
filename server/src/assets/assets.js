const fs = require('fs')

const Player = require('./Player')

const assetsDir = []

const assets = {
  Player
}

assetsDir.forEach(directory => {
  fs.readdir(`./src/${directory}/`, (err, files) => {
    if (err) return console.error(err)
    files.forEach(file => {
      const asset = require(`./src/${directory}/${file}`)
      const assetName = file.split('.')[0]
      assets[assetName] = asset
      delete require.cache[require.resolve(`./src/${directory}/${file}`)]
    })
  })
})

module.exports = assets
