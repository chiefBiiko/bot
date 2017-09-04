module.exports = function flag(e, next, db=DB) {  // incoming order: 2
  // db subsets
  const pnames = Object.keys(db)
  const cnames = [ ...new Set(pnames.map(pn => db[pn].category)) ]
  // detecting product query
  e.exactProduct = pnames.filter(pn => e.text.includes(pn))
  e.approxProduct = e.exactProduct.length ? [] :
    pnames.filter(pn => {
      return e.tokens.some(t => {
        return natural.LevenshteinDistance(t, pn) <= STASH.LEVEN
      })
    })
  // detecting category query
  e.exactCategory = cnames.filter(cn => e.text.includes(cn))
  e.approxCategory = e.exactCategory.length ? [] :
    cnames.filter(cn => {
      return e.tokens.some(t => {
        return natural.LevenshteinDistance(t, cn) <= STASH.LEVEN
      })
    })
  // detecting attribute query
  e.requestsFeature = /feature/.test(e.text)
  e.requestsPicture = /pic|picture|photo/.test(e.text)
  e.requestsPrice = /cost|price/.test(e.text)
  e.requestsRating = /rating|review/.test(e.text)
  // detecting mapping query
  e.requestsMin = /min|minimum|cheapest|costs the least/.test(e.text)
  e.requestsMax = /max|maximum|most expensive|costs the most/.test(e.text)
  e.requestsAvg = /avg|average|mean/.test(e.text)
  e.requestsDif = /difference|compare|comparison/.test(e.text)

  console.log(`text: ${e.text}\n` +
              `tokens: ${e.tokens}\n` +
              `exactProduct: ${e.exactProduct}\n` +
              `approxProduct: ${e.approxProduct}\n` +
              `exactCategory: ${e.exactCategory}\n` +
              `approxCategory: ${e.approxCategory}\n` +
              `requestsFeatures: ${e.requestsFeature}\n` +
              `requestsPictures: ${e.requestsPicture}\n` +
              `requestsPrice: ${e.requestsPrice}\n` +
              `requestsRating: ${e.requestsRating}\n` +
              `requestsMin: ${e.requestsMin}\n` +
              `requestsMax: ${e.requestsMax}\n` +
              `requestsAvg: ${e.requestsAvg}\n` +
              `requestsDif: ${e.requestsDif}`)

  next()
}
