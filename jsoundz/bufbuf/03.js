process.stdin.on('data', chunk => {
  var buf = new Buffer(chunk.byteLength)
  for (let i = 0; i < chunk.byteLength; i++) {
    buf.write(String.fromCharCode(
      chunk[i] !== 0x2e ? chunk[i] : 0x21
    ), i, 1)
  }
  console.log(buf)
})