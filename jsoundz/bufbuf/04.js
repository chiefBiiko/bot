const fs = require('fs')

const N = '\n'.charCodeAt(0)

fs.readFile(process.argv[2], (err, buf) => {
  var head = 0
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === N || i === buf.length - 1) {
      console.log(buf.slice(head, i + 1))
      head = i + 1
    }
  }
})