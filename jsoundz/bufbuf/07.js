const uint32 = new Uint32Array(1)
uint32.fill(Number(process.argv[2]))
const uint16 = new Uint16Array(uint32.buffer)
console.log(JSON.stringify(uint16))