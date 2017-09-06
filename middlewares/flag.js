module.exports = (e, next) => { // incoming, order: 2
  e.flags = {}
  // detecting attribute query
  e.flags.wantsFeature = /feature/.test(e.text)
  e.flags.wantsPicture = /pic|picture|photo/.test(e.text)
  e.flags.wantsPrice = /cost|price/.test(e.text)
  e.flags.wantsRating = /rating|review/.test(e.text)
  // detecting mapping query
  e.flags.wantsMin = /min|minimum|cheapest|costs the least/.test(e.text)
  e.flags.wantsMax = /max|maximum|most expensive|costs the most/.test(e.text)
  e.flags.wantsAvg = /avg|average|mean/.test(e.text)
  e.flags.wantsDif = /difference|compare|comparison/.test(e.text)
  next()
}
