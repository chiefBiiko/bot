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
  //console.log(DB)
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
    e.stash.exactProduct = productmatches.exact
    e.stash.approxProduct = productmatches.approx
    e.stash.exactCategory = categorymatches.exact
    e.stash.approxCategory = categorymatches.approx
    // put all exact product hits from DB on e.stash
    e.stash.hitProducts = productmatches.exact.reduce((acc, cur) => {
      acc[cur] = DB[cur]
      return acc
    }, {})

    // // get all products for every hit category
    // e.productsByCategory = e.exactCategory.reduce((acc, cname) => { // arr 2 obj
    //   acc[cname] = Object.keys(DB)
    //     .map(pname => DB[pname])
    //     .filter(product => product.category === cname) // TODO?
    //   return acc
    // }, {})
    // provide wanted info thru map over DB!!!

    // // attribute query --- these only apply to exact product matches
    // // make these objects too and guard them in an if statement
    // // do all possible stuff FOR EVERY array item, store in an {}
    // e.stash.features = /feature/.test(e.text) ?
    //   e.exactProduct.reduce((acc, pname) => { // array to object
    //     acc[pname] = DB[pname].features
    //     return acc
    //   }, {}) : {}
    //   // DB[e.exactProduct[0]].features : []
    // e.stash.pictures = /pic(ture)?|photo/.test(e.text) ?
    //   e.exactProduct.reduce((acc, pname) => { // array to object
    //     acc[pname] = DB[pname].pictures
    //     return acc
    //   }, {}) : {}
    //   // DB[e.exactProduct[0]].pictures : []

////// dif query on hold for now; might be a little complicated just now
////e.flags.wantsDif = /difference|compare|comparison/.test(e.text)

//     //e.flags.wantsPrice = /cost|price/.test(e.text)
//     // supply price if wanted
//     // MAKE e.stash.price, e.stash.rating an object
//     if (/cost|price/.test(e.text)) { // wants price
// //////if (e.exactProduct.length !== 0) { // TODO TODO
//         // e.stash.price = DB[e.exactProduct[0]].price
//         e.flags.price = exactProduct.reduce((acc, pname) => { // array to object
//           acc[pname] = DB[pname].price
//           return acc
//         }, {})
// //////} else if (e.exactCategory.length !== 0) {
//         // wantsMin TODO TODO TODO
//         e.flags.price = Object.keys(DB)
//           .filter(pname => DB[pname].category === e.exactCategory)
//           .reduce((acc, pname) => {
//             const pprice = DB[pname].price
//             return pprice < acc ? pprice : acc
//           }, Infinity)
//         // wantsMax
// //////}
//     }
//     e.flags.wantsRating = /rating|review/.test(e.text)

    next()
    return e // 4 dev tests only, ignored by botpress
  }
  // return a closure
  return checkAgainstDB
}
