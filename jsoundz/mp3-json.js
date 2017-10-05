const fs = require('fs')
const { buffer2JSON } = require('./buffer-json')

module.exports = function mp32JSON(mp3file) {
  return buffer2JSON(fs.readFileSync(mp3file))
}
