'use strict'

const { LevenshteinDistance } = require('natural')

module.exports = (text, tokens, targetarray, cutoff) => { // Levenshtein cutoff
  const exact = targetarray.filter(tname => RegExp(`${tname}`, 'i').test(text)) //text.includes(tname)
  var approx = {}
  if (exact.length === 0) {
    // Array.prototype.push.apply(approx, targetarray.filter(tname => {
    //   return tokens.some(token => {
    //     return LevenshteinDistance(token.toLowerCase(), tname.toLowerCase()) <=
    //       cutoff
    //   })
    // }))
    approx = targetarray.reduce((acc, tname) => {
      const approxd = tokens.filter(token => {
        return LevenshteinDistance(token.toLowerCase(), tname.toLowerCase()) <=
          cutoff
      })[0]
      if (approxd) acc[approxd] = tname
      return acc
    }, {})
  }
  return { exact: exact, approx: approx }
}
