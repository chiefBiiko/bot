const { LevenshteinDistance } = require('natural')

module.exports = (text, tokens, targetarray, cutoff) => { // Levenshtein cutoff
  const exact = targetarray.filter(tname => text.includes(tname))
  const approx = []
  if (exact.length === 0) {
    Array.prototype.push.apply(approx, targetarray.filter(tname => {
      return tokens.some(token => LevenshteinDistance(token, tname) <= cutoff)
    }))
  }
  return [ exact, approx ]
}
