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
    // provide wanted info thru map over DB!!!
    e.stash = {}
    // detecting attribute query
    e.stash.wantsFeature = /feature/.test(e.text)
    e.stash.wantsPicture = /pic|picture|photo/.test(e.text)
    e.stash.wantsPrice = /cost|price/.test(e.text)
    e.stash.wantsRating = /rating|review/.test(e.text)
    // detecting mapping query
    e.stash.wantsMin = /min|minimum|cheapest|costs the least/.test(e.text)
    e.stash.wantsMax = /max|maximum|most expensive|costs the most/.test(e.text)
    e.stash.wantsAvg = /avg|average|mean/.test(e.text)
    e.stash.wantsDif = /difference|compare|comparison/.test(e.text)
    next()
  }
  // return a closure
  return checkAgainstDB
}
