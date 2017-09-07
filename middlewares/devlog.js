module.exports = (e, next) => {
  console.log(`e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.exactProduct: ${JSON.stringify(e.exactProduct)}\n` +
              `e.approxProduct: ${JSON.stringify(e.approxProduct)}\n` +
              `e.exactCategory: ${JSON.stringify(e.exactCategory)}\n` +
              `e.approxCategory: ${JSON.stringify(e.approxCategory)}\n` +
              `e.productsByCategory: ${JSON.stringify(e.productsByCategory)}\n` +
              `e.stash.features: ${JSON.stringify(e.stash.features)}\n` +
              `e.stash.pictures: ${JSON.stringify(e.stash.pictures)}\n` +
              `e.stash.price: ${e.stash.price}\n` +
              `e.stash.wantsRating: ${e.stash.wantsRating}\n` +
              `e.flags.wantsMin: ${e.flags.wantsMin}\n` +
              `e.flags.wantsMax: ${e.flags.wantsMax}\n` +
              `e.flags.wantsAvg: ${e.flags.wantsAvg}\n` +
              `e.flags.wantsDif: ${e.flags.wantsDif}`)
  next()
}
