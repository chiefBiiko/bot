/*
  CONGRATULATIONS on creating your first Botpress bot!

  This is the programmatic entry point of your bot.
  Your bot's logic resides here.

  Here's the next steps for you:
  1. Read this file to understand how this simple bot works
  2. Read the `content.yml` file to understand how messages are sent
  3. Install a connector module (Facebook Messenger and/or Slack)
  4. Customize your bot!

  Happy bot building!

  The Botpress Team
  ----
  Getting Started (Youtube Video): https://www.youtube.com/watch?v=HTpUmDz9kRY
  Documentation: https://botpress.io/docs
  Our Slack Community: https://slack.botpress.io
*/

'use strict'

const natural = require('natural')

module.exports = function(bp) {

  const STASH = {  // preprocessing stuff bundled
    DB_UPD_REF: 0,
    LEVEN: 3,  // Levenshtein distance approximation cutoff
    wordTokenizer: new natural.WordTokenizer()  // std english word tokenizer
  }

  var DB  // in-memory copy of external database; updated repeatedly
  bp.db.kvs.get('products').then(db => DB = db).catch(console.error)
  STASH.DB_UPD_REF = setInterval(() => {
    console.log('updating DB...')
    bp.db.kvs.get('products').then(db => DB = db).catch(console.error)
  }, 1000 * 60 * 1)

  function lowerCaseAndTokenize(e, next) {  // incoming, order: 1
    e.text = e.text.toLowerCase()
    e.tokens = STASH.wordTokenizer.tokenize(e.text)
    next()
  }

  function flag(e, next) {  // incoming, order: 2
    // DB subsets
    const pnames = Object.keys(DB)
    const cnames = [ ...new Set(pnames.map(pname => DB[pname].category)) ]
    // detecting product query
    e.exactProduct = pnames.filter(pname => e.text.includes(pname))
    e.approxProduct = e.exactProduct.length ? [] :
      pnames.filter(pname => {
        return e.tokens.some(token => {
          return natural.LevenshteinDistance(token, pname) <= STASH.LEVEN
        })
      })
    // detecting category query
    e.exactCategory = cnames.filter(cname => e.text.includes(cname))
    e.approxCategory = e.exactCategory.length ? [] :
      cnames.filter(cname => {
        return e.tokens.some(token => {
          return natural.LevenshteinDistance(token, cname) <= STASH.LEVEN
        })
      })
    // detecting attribute query
    e.wantsFeature = /feature/.test(e.text)
    e.wantsPicture = /pic|picture|photo/.test(e.text)
    e.wantsPrice = /cost|price/.test(e.text)
    e.wantsRating = /rating|review/.test(e.text)
    // detecting mapping query
    e.wantsMin = /min|minimum|cheapest|costs the least/.test(e.text)
    e.wantsMax = /max|maximum|most expensive|costs the most/.test(e.text)
    e.wantsAvg = /avg|average|mean/.test(e.text)
    e.wantsDif = /difference|compare|comparison/.test(e.text)
    next()
  }

  // assemble e.flags to actions with conditions object!!! UMM and stuff...
  // see how to make good use of bp.convo AND what happened to outgoing???

  // exact product and feature
  bp.hear({
    exactProduct: arr => arr.length > 0,
    wantsFeature: true
  }, (e, next) => {
    e.reply('#exact-product-feature', {
      product: e.exactProduct[0],
      features: DB[e.exactProduct[0]].features.join(', ')
    })
  //next()
  })
  // exact product and picture
  bp.hear({
    exactProduct: arr => arr.length > 0,
    wantsPicture: true
  }, (e, next) => {
    e.reply('#exact-product-picture', {
      product: e.exactProduct[0],
      pictures: DB[e.exactProduct[0]].pictures.join(', ')
    })
  //next()
  })
  // exact product and price
//...
  // exact product and rating
//...
  // exact product only
  bp.hear({ exactProduct: arr => arr.length > 0 }, (e, next) => {
    e.reply('#exact-product-only', { product: e.exactProduct[0] })
  //next()
  })
  // approx product only
  // send y/n button along n send 2 #exact-product-only if y
  bp.hear({ approxProduct: arr => arr.length > 0 }, (e, next) => {
    e.reply('#approx-product-only', { product: e.approxProduct[0] })
  //next()
  })

  // registering my custom middlewares here!!! multiple???
  bp.middlewares.register({
    name: 'lowerCaseAndTokenize',  // friendly name
    type: 'incoming',  // either incoming or outgoing
    order: 1,  // arbitrary number
    handler: lowerCaseAndTokenize,  // the middleware function
    module: undefined,  // the name of the module, if any
    description: '...'
  })
  bp.middlewares.register({
    name: 'flag',
    type: 'incoming',
    order: 2,
    handler: flag,
    module: undefined,
    description: '...'
  })
  bp.middlewares.register({
    name: 'devlog',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/devlog'),
    module: undefined,
    description: '...'
  })

  // reload middlewares
  bp.middlewares.load()

}
