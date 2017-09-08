'use strict'

module.exports = (e, next) => {
  // e.flags = {}
  // // check if attributes wanted
  // e.flags.wantsFeatures = /feature/.test(e.text)
  // e.flags.wantsPictures = /pic(ture)?|photo/.test(e.text)
  // e.flags.wantsPrice = /cost|price/.test(e.text)
  // e.flags.wantsRating = /rating|review/.test(e.text)
  // // check if mapping wanted
  // e.flags.wantsMin = /min|minimum|cheapest|costs the least/.test(e.text)
  // e.flags.wantsMax = /max|maximum|most expensive|costs the most/.test(e.text)
  // e.flags.wantsAvg = /avg|average|mean/.test(e.text)
  next()
  return e // 4 dev tests only, ignored by botpress
}
