module.exports = (e, next) => {
  console.log(`e.user.id: ${e.user.id}\n` +
              `e.text: ${e.text}\n` +
              `e.tokens: ${JSON.stringify(e.tokens)}\n` +
              `e.stash.exactProducts: ${JSON.stringify(e.stash.exactProducts)}\n` +
              `e.stash.approxProducts: ${JSON.stringify(e.stash.approxProducts)}\n` +
              `e.stash.exactCategories: ${JSON.stringify(e.stash.exactCategories)}\n` +
              `e.stash.approxCategories: ${JSON.stringify(e.stash.approxCategories)}\n` +
              `e.stash.hitProducts: ${JSON.stringify(e.stash.hitProducts)}`)
  next()
}
