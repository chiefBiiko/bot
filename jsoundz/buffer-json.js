module.exports = {
  buffer2JSON: function buffer2JSON(buffer) {
    return JSON.stringify(Array.from(new Uint8Array(buffer)))
  },
  JSON2buffer: function JSON2buffer(json) {
    const byteArray = JSON.parse(json)
    const buffer = new ArrayBuffer(byteArray.length)
    const bufferView = new Uint8Array(buffer)
    for (let i = 0; i < byteArray.length; i++) {
      bufferView[i] = byteArray[i]
    }
    return buffer
  }
}
