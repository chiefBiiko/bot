'use strict'

const { LevenshteinDistance } = require('natural')

module.exports = (text, tokens, targetarray, cutoff) => { // Levenshtein cutoff
  const exact = targetarray.filter(tname => RegExp(`${tname}`, 'i').test(text)) //text.includes(tname)
  const approx = []
  if (exact.length === 0) {
    Array.prototype.push.apply(approx, targetarray.filter(tname => {
      return tokens.some(token => {
        return LevenshteinDistance(token.toLowerCase(), tname.toLowerCase()) <=
          cutoff
      })
    }))
  }
  return { exact: exact, approx: approx }
}
