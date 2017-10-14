const buffers = []

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) buffers.push(chunk)
})

process.stdin.on('end', () => console.log(Buffer.concat(buffers)))