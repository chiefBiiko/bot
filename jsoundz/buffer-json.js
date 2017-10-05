module.exports = {
  buffer2JSON: function buffer2JSON(buffer) {
    return JSON.stringify(Array.from(new Uint16Array(buffer)))
  },
  JSON2buffer: function JSON2buffer(json) {
    const byteArray = JSON.parse(json)
    const buffer = new ArrayBuffer(byteArray.length * 2)
    const bufferView = new Uint16Array(buffer)
    for (let i = 0; i < byteArray.length; i++) {
      bufferView[i] = byteArray[i]
    }
    return buffer
  }
}
