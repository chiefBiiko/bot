module.exports = (e, next) => {
  console.log(`e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.stash.exactProduct: ${JSON.stringify(e.stash.exactProduct)}\n` +
              `e.stash.approxProduct: ${JSON.stringify(e.stash.approxProduct)}\n` +
              `e.stash.exactCategory: ${JSON.stringify(e.stash.exactCategory)}\n` +
              `e.stash.approxCategory: ${JSON.stringify(e.stash.approxCategory)}\n` +
              `e.flags.wantsFeatures: ${e.flags.wantsFeatures}\n` +
              `e.flags.wantsPictures: ${e.flags.wantsPictures}\n` +
              `e.flags.wantsPrice: ${e.flags.wantsPrice}\n` +
              `e.flags.wantsRating: ${e.flags.wantsRating}\n` +
              `e.flags.wantsMin: ${e.flags.wantsMin}\n` +
              `e.flags.wantsMax: ${e.flags.wantsMax}\n` +
              `e.flags.wantsAvg: ${e.flags.wantsAvg}\n` +
              `e.stash: ${JSON.stringify(e.stash)}`)
  next()
}
