const { WordTokenizer } = require('natural')
const wordTokenizer = new WordTokenizer()

module.exports = (e, next) => { // incoming, order: 1
  e.text = e.text.toLowerCase()
  e.tokens = wordTokenizer.tokenize(e.text)
  next()
}
