'use strict'

const matchExAx = require('./../helpers/matchExAx')

module.exports = (bp, minutes) => {
  var DB = {} // in-memory copy of products collection, updated repeatedly
  // initial fullfillment
  bp.db.kvs.get('products').then(db => DB = db).catch(console.error)
  // schedule update
  setInterval(() => { // updating DB every minutes
    console.log(`updating DB @ ${new Date().toUTCString()}...`)
    bp.db.kvs.get('products').then(db => DB = db).catch(console.error)
    console.log(DB)
  }, 1000 * 60 * minutes)
  // assemble factory return
  const checkAgainstDB = (e, next) => { // closes over DB
    // DB subsets
    const productnames = Object.keys(DB)
    const categorynames = [ ...new Set(productnames.map(pname => {
      return DB[pname].category
    })) ]
    // product/category hits
    const productmatches = matchExAx(e.text, e.tokens, productnames, 3)
    const categorymatches = matchExAx(e.text, e.tokens, categorynames, 3)
    // store exact and approx matched product/category names on e.flags
    e.stash = {}
    // [ e.flags.exactProduct, e.flags.approxProduct ] = productmatches;
    // [ e.flags.exactCategory, e.flags.approxCategory ] = categorymatches;
    e.stash.exactProducts = productmatches.exact
    e.stash.approxProducts = productmatches.approx
    e.stash.exactCategories = categorymatches.exact
    e.stash.approxCategories = categorymatches.approx
    // put all exact product hits from DB on e.stash
    e.stash.hitProducts = productmatches.exact.reduce((acc, cur) => {
      acc[cur] = DB[cur]
      return acc
    }, {})
    next()
    return e // 4 dev tests only, ignored by botpress
  }
  // return a closure
  return checkAgainstDB
}
