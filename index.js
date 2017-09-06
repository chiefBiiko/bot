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

const { LevenshteinDistance } = require('natural')

module.exports = bp => {

  const LEVEN = 3 // Levenshtein distance approximation cutoff
  const CONVOS = new Map()
  var DB = {} // in-memory copy of external database, updated repeatedly
  var DB_UPD_REF
  bp.db.kvs.get('products').then(db => DB = db).catch(console.error)
  DB_UPD_REF = setInterval(() => {
    console.log(`updating DB @ ${new Date().toUTCString()}...`)
    bp.db.kvs.get('products').then(db => DB = db).catch(console.error)
  }, 1000 * 60 * 1)

  const checkAgainstDB = (e, next) => {
    // DB subsets
    const pnames = Object.keys(DB)
    const cnames = [ ...new Set(pnames.map(pname => DB[pname].category)) ]
    // werckeer
    function matchExactAndApprox(text, tokens, targetarray) {
      const exact = targetarray.filter(tname => text.includes(tname))
      const approx = exact.length !== 0 ? [] :
        targetarray.filter(tname => {
          return tokens.some(token => {
            return LevenshteinDistance(token, tname) <= LEVEN
          })
        })
      return [ exact, approx ]
    }
    // detecting product query
    e.exactProduct = pnames.filter(pname => e.text.includes(pname))
    e.approxProduct = e.exactProduct.length ? [] :
      pnames.filter(pname => {
        return e.tokens.some(token => {
          return LevenshteinDistance(token, pname) <= LEVEN
        })
      })
    // detecting category query
    e.exactCategory = cnames.filter(cname => e.text.includes(cname))
    e.approxCategory = e.exactCategory.length ? [] :
      cnames.filter(cname => {
        return e.tokens.some(token => {
          return LevenshteinDistance(token, cname) <= LEVEN
        })
      })
      next()
  }

  // assemble e.flags to actions with conditions object!!! UMM and stuff...
  // see how to make good use of bp.convo AND what happened to outgoing???

  // all the hear handlers: always send over existing convo!!!
  // convo

  // if e.user.first_name and set name on CONVOS, updates user name
  bp.hear(/.*/, (e, next) => {
    if (e.user.first_name.length !== 0 && CONVOS.has(e.user.id)) {
      const updconva = CONVOS.get(e.user.id)
      updconva.first_name = e.user.first_name
      CONVOS.set(e.user.id, updconva)
    }
    next()
  })

  // welcome
  bp.hear({
    text: /hi|hallo|hello|hey/
  //,user: obj => obj.first_name === 'Anonymous'
}, (e, next) => {
    console.log(CONVOS.has(e.user.id))
    if (CONVOS.has(e.user.id)) {
      const conva = CONVOS.get(e.user.id)
      conva.convo.say('#welcome-again', { first_name: conva.first_name })
      return
    }
    // console.log(bp.convo.find(e))  // always undefined, so forget convo
    // e.reply('#welcome', { first_name: convo.get('first_name') })
    CONVOS.set(e.user.id, {
      first_name: e.user.first_name,
      convo: bp.convo.start(e, convo => {
        convo.say('#welcome', { first_name: e.user.first_name })
      })
    })
    next()
  })

  // exact product and feature
  bp.hear({
    exactProduct: arr => arr.length !== 0,
    flags: obj => obj.wantsFeature
  }, (e, next) => {
    e.reply('#exact-product-feature', {
      product: e.exactProduct[0],
      features: DB[e.exactProduct[0]].features.join(', ')
    })
  //next()
  })

  // exact product and picture
  bp.hear({
    exactProduct: arr => arr.length !== 0,
    flags: obj => obj.wantsPicture
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
  bp.hear({ exactProduct: arr => arr.length !== 0 }, function(e, next) {
    e.reply('#exact-product-only', { product: e.exactProduct[0] })
  //next()
  })

  // approx product only
  // send y/n button along n send 2 #exact-product-only if y
  bp.hear({ approxProduct: arr => arr.length !== 0 }, function(e, next) {
    e.reply('#approx-product-only', { product: e.approxProduct[0] })
  //next()
  })

  // registering middlewares
  bp.middlewares.register({
    name: 'lowerCaseAndTokenize', // friendly name
    type: 'incoming', // either incoming or outgoing
    order: 1, // arbitrary number
    handler: require('./middlewares/lowerCaseAndTokenize'), // the middleware function
    module: undefined, // the name of the module, if any
    description: '...'
  })
  bp.middlewares.register({
    name: 'flag',
    type: 'incoming',
    order: 2,
    handler: require('./middlewares/flag'),
    module: undefined,
    description: '...'
  })
  bp.middlewares.register({
    name: 'checkForUserName',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/checkForUserName'), //require('./middlewares/checkForUserName'),
    module: undefined,
    description: '...'
  })
  bp.middlewares.register({
    name: 'checkAgainstDB',
    type: 'incoming',
    order: 4,
    handler: checkAgainstDB, //require('./middlewares/checkForUserName'),
    module: undefined,
    description: '...'
  })
  bp.middlewares.register({
    name: 'devlog',
    type: 'incoming',
    order: 5,
    handler: require('./middlewares/devlog'),
    module: undefined,
    description: '...'
  })

  // reload middlewares
  bp.middlewares.load()

}
