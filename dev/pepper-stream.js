const pepperFactory = require('./..')
const { Transform } = require('stream')
const is = require('./be')

module.exports = function pepperStream(func, paramNames, opts) {
  const transformer = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, _, next) {
      if (Buffer.isBuffer(chunk) || is.string(chunk)) {
        try {
          chunk = JSON.parse(chunk.toString())
        } catch(_) {}
      }
      const rtn = this.pepper(chunk)
      if (rtn !== undefined) this.push(rtn)
      next()
    }
  })
  transformer.pepper = pepperFactory(func, paramNames, opts)
  return transformer
}
