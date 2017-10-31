const pepperFactory = require('.')
const TransformStream = require('stream').Transform

const pepperStream = (func, paramNames, opts) => {
  const stream = new TransformStream({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, _, next) {
      try { // if buffer or string check if JSON
        chunk = JSON.parse(chunk.toString())
      } catch(_) {}
      const rtn = this.pepper(chunk)
      if (rtn !== undefined) this.push(rtn)
      next()
    }
  })
  stream.pepper = pepperFactory(func, paramNames, opts)
  return stream
}

module.exports = pepperStream

/*********************************************************/

const stringify = (a, b, c) => `a:${a}, b:${b}, c:${c}\n`

process.stdin
  .pipe(pepperStream(stringify, [ 'a', 'b', 'c' ]))
    .pipe(process.stdout)