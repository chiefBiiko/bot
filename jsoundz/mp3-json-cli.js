const fs = require('fs')
const { buffer2JSON } = require('./buffer-json')

function CLImp32JSON(mp3file) {
  try {
    console.log(buffer2JSON(fs.readFileSync(mp3file)))
  } catch (err) {
    console.error(err);
  }
}

CLImp32JSON.call(null, process.argv[2])
