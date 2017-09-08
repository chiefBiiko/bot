module.exports = (e, next) => {
  console.log(`e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.stash.exactProduct: ${JSON.stringify(e.stash.exactProduct)}\n` +
              `e.stash.approxProduct: ${JSON.stringify(e.stash.approxProduct)}\n` +
              `e.stash.exactCategory: ${JSON.stringify(e.stash.exactCategory)}\n` +
              `e.stash.approxCategory: ${JSON.stringify(e.stash.approxCategory)}\n` +
              `e.stash.hitProducts: ${JSON.stringify(e.stash.hitProducts)}`)
  next()
}
