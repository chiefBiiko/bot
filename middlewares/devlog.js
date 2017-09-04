module.exports = function devlog(e, next) {
  console.log(`e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.exactProduct: ${JSON.stringify(e.exactProduct)}\n` +
              `e.approxProduct: ${JSON.stringify(e.approxProduct)}\n` +
              `e.exactCategory: ${JSON.stringify(e.exactCategory)}\n` +
              `e.approxCategory: ${JSON.stringify(e.approxCategory)}\n` +
              `e.requestsFeatures: ${e.wantsFeature}\n` +
              `e.requestsPictures: ${e.wantsPicture}\n` +
              `e.requestsPrice: ${e.wantsPrice}\n` +
              `e.requestsRating: ${e.wantsRating}\n` +
              `e.requestsMin: ${e.wantsMin}\n` +
              `e.requestsMax: ${e.wantsMax}\n` +
              `e.requestsAvg: ${e.wantsAvg}\n` +
              `e.requestsDif: ${e.wantsDif}`)
  next()
}
