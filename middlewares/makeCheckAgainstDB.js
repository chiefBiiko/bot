const matchExactAndApprox = require('./../helpers/matchExactAndApprox')

module.exports = (bp, minutes) => {
  var DB = {} // in-memory copy of external database, updated repeatedly
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
    const pnames = Object.keys(DB)
    const cnames = [ ...new Set(pnames.map(pname => DB[pname].category)) ]
    // product/category hits
    const productmatches = matchExactAndApprox(e.text, e.tokens, pnames, 3);
    const categorymatches = matchExactAndApprox(e.text, e.tokens, cnames, 3);
    [ e.exactProduct, e.approxProduct ] = productmatches;
    [ e.exactCategory, e.approxCategory ] = categorymatches;
    // get all products for every hit category
    e.productsByCategory = e.exactCategory.reduce((acc, cname) => { // arr 2 obj
      acc[cname] = Object.keys(DB)
        .map(pname => DB[pname])
        .filter(product => product.category === cname) // TODO?
      return acc
    }, {})
    // provide wanted info thru map over DB!!!
    e.flags = {}, e.stash = {}
    // attribute query --- these only apply to exact product matches
    // make these objects too and guard them in an if statement
    // do all possible stuff FOR EVERY array item, store in an {}
    e.stash.features = /feature/.test(e.text) ?
      e.exactProduct.reduce((acc, pname) => { // array to object
        acc[pname] = DB[pname].features
        return acc
      }, {}) : {}
      // DB[e.exactProduct[0]].features : []
    e.stash.pictures = /pic(ture)?|photo/.test(e.text) ?
      e.exactProduct.reduce((acc, pname) => { // array to object
        acc[pname] = DB[pname].pictures
        return acc
      }, {}) : {}
      // DB[e.exactProduct[0]].pictures : []

    // check if mapping wanted --- call these flags!
    e.flags.wantsMin = /min|minimum|cheapest|costs the least/.test(e.text)
    e.flags.wantsMax = /max|maximum|most expensive|costs the most/.test(e.text)
    e.flags.wantsAvg = /avg|average|mean/.test(e.text)
////// dif query on hold for now; might be a little complicated just now
////e.stash.wantsDif = /difference|compare|comparison/.test(e.text)

    //e.stash.wantsPrice = /cost|price/.test(e.text)
    // supply price if wanted
    // MAKE e.stash.price, e.stash.rating an object
    if (/cost|price/.test(e.text)) { // wants price
//////if (e.exactProduct.length !== 0) { // TODO TODO
        // e.stash.price = DB[e.exactProduct[0]].price
        e.stash.price = exactProduct.reduce((acc, pname) => { // array to object
          acc[pname] = DB[pname].price
          return acc
        }, {})
//////} else if (e.exactCategory.length !== 0) {
        // wantsMin TODO TODO TODO
        e.stash.price = Object.keys(DB)
          .filter(pname => DB[pname].category === e.exactCategory)
          .reduce((acc, pname) => {
            const pprice = DB[pname].price
            return pprice < acc ? pprice : acc
          }, Infinity)
        // wantsMax
//////}
    }
    e.stash.wantsRating = /rating|review/.test(e.text)

    next()
  }
  // return a closure
  return checkAgainstDB
}
