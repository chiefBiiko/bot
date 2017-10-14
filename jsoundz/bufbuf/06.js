process.stdin.on('data', chunk => {
  console.log(JSON.stringify(new Uint8Array(chunk)))
})