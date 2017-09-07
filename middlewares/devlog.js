module.exports = (e, next) => {
  console.log(`e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.exactProduct: ${JSON.stringify(e.exactProduct)}\n` +
              `e.approxProduct: ${JSON.stringify(e.approxProduct)}\n` +
              `e.exactCategory: ${JSON.stringify(e.exactCategory)}\n` +
              `e.approxCategory: ${JSON.stringify(e.approxCategory)}\n` +
              `e.stash.wantsFeature: ${e.stash.wantsFeature}\n` +
              `e.stash.wantsPicture: ${e.stash.wantsPicture}\n` +
              `e.stash.wantsPrice: ${e.stash.wantsPrice}\n` +
              `e.stash.wantsRating: ${e.stash.wantsRating}\n` +
              `e.stash.wantsMin: ${e.stash.wantsMin}\n` +
              `e.stash.wantsMax: ${e.stash.wantsMax}\n` +
              `e.stash.wantsAvg: ${e.stash.wantsAvg}\n` +
              `e.stash.wantsDif: ${e.stash.wantsDif}`)
  next()
}
