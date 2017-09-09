'use strict'
// TODO: replace all single space literals in regexes with multi spaces
module.exports = (e, next) => {
  Object.keys(e.stash.hitProducts).forEach(product => {
    e.stash.hitProducts[product].flags = {
      features:
        RegExp(`features?.{0,13}(\s*of\s*the)?\s*${product}`)
          .test(e.text),
      pictures:
        RegExp(`pictures?.{0,13}(\s*(of)|(for)\s*the)?\s*${product}`)
          .test(e.text),
      price:
        RegExp(`(price.{0,13}(\s*(of)|(for)\s*the)?)|(costs\s*the)\s*` +
               `${product}`)
          .test(e.text),
      ratings:
        RegExp(`(ratings?)|(reviews?).{0,13}(\s*(of)|(for)\s*the)?\s*` +
               `${product}`)
          .test(e.text),
      wantsMinRating:
        RegExp(`(min)|(minimum)|(worst)|(badd?est)\s*(rating)|(review).{0,13}` +
               `(\s*(of)|(for)\s*the)?\s*${product}`)
          .test(e.text),
      wantsMaxRating:
        RegExp(`(max)|(maximum)|(best)|(highest)\s*(rating)|(review).{0,13}` +
               `(\s*(of)|(for)\s*the)?\s*${product}`)
          .test(e.text),
      wantsAvgRating:
        RegExp(`(avg)|(average)|(mean)|(median)|(mid(dle)?)\s*` +
               `(rating)|(review).{0,13}(\s*(of)|(for)\s*the)?\s*${product}`)
          .test(e.text)
    }
  })
  // e.flags = {}
  // // check if attributes wanted
  // e.flags.wantsFeatures = /feature/.test(e.text)
  // e.flags.wantsPictures = /pic(ture)?|photo/.test(e.text)
  // e.flags.wantsPrice = /cost|price/.test(e.text)
  // e.flags.wantsRatings = /rating|review/.test(e.text)
  // // check if mapping wanted
  // e.flags.wantsMin = /min|minimum|cheapest|costs the least/.test(e.text)
  // e.flags.wantsMax = /max|maximum|most expensive|costs the most/.test(e.text)
  // e.flags.wantsAvg = /avg|average|mean/.test(e.text)
  next()
  return e // 4 dev tests only, ignored by botpress
}
