module.exports = (e, next) => { // incoming, order: 4
  console.log(`e.user.first_name: ${e.user.first_name}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.exactProduct: ${JSON.stringify(e.exactProduct)}\n` +
              `e.approxProduct: ${JSON.stringify(e.approxProduct)}\n` +
              `e.exactCategory: ${JSON.stringify(e.exactCategory)}\n` +
              `e.approxCategory: ${JSON.stringify(e.approxCategory)}\n` +
              `e.flags.wantsFeature: ${e.flags.wantsFeature}\n` +
              `e.flags.wantsPicture: ${e.flags.wantsPicture}\n` +
              `e.flags.wantsPrice: ${e.flags.wantsPrice}\n` +
              `e.flags.wantsRating: ${e.flags.wantsRating}\n` +
              `e.flags.wantsMin: ${e.flags.wantsMin}\n` +
              `e.flags.wantsMax: ${e.flags.wantsMax}\n` +
              `e.flags.wantsAvg: ${e.flags.wantsAvg}\n` +
              `e.flags.wantsDif: ${e.flags.wantsDif}`)
  next()
}
