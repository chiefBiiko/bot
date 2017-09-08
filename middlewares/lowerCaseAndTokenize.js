'use strict'

const { WordTokenizer } = require('natural')
const wordTokenizer = new WordTokenizer()

module.exports = (e, next) => {
  e.text = e.text.toLowerCase()
  e.tokens = wordTokenizer.tokenize(e.text)
  next()
  return e // 4 dev tests only, ignored by botpress
}
