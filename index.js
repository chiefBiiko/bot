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

  // export this one
  function lowerCaseAndTokenize(e, next) {  // incoming, order: 1
    e.text = e.text.toLowerCase()
    e.tokens = STASH.wordTokenizer.tokenize(e.text)
    console.log(DB)
    next()
  }

  function flag(e, next) {  // incoming, order: 2, CAUTION: closure!
    // db subsets
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
    e.requestsFeature = /feature/.test(e.text)
    e.requestsPicture = /pic|picture|photo/.test(e.text)
    e.requestsPrice = /cost|price/.test(e.text)
    e.requestsRating = /rating|review/.test(e.text)
    // detecting mapping query
    e.requestsMin = /min|minimum|cheapest|costs the least/.test(e.text)
    e.requestsMax = /max|maximum|most expensive|costs the most/.test(e.text)
    e.requestsAvg = /avg|average|mean/.test(e.text)
    e.requestsDif = /difference|compare|comparison/.test(e.text)
    next()
  }

  function devlog(e, next) {
    console.log(`text: ${e.text}\n` +
                `tokens: ${JSON.stringify(e.tokens)}\n` +
                `exactProduct: ${JSON.stringify(e.exactProduct)}\n` +
                `approxProduct: ${JSON.stringify(e.approxProduct)}\n` +
                `exactCategory: ${JSON.stringify(e.exactCategory)}\n` +
                `approxCategory: ${JSON.stringify(e.approxCategory)}\n` +
                `requestsFeatures: ${e.requestsFeature}\n` +
                `requestsPictures: ${e.requestsPicture}\n` +
                `requestsPrice: ${e.requestsPrice}\n` +
                `requestsRating: ${e.requestsRating}\n` +
                `requestsMin: ${e.requestsMin}\n` +
                `requestsMax: ${e.requestsMax}\n` +
                `requestsAvg: ${e.requestsAvg}\n` +
                `requestsDif: ${e.requestsDif}`)
    next()
  }

  // assemble e.flags to actions with conditions object!!! UMM and stuff
  //bp.hear({...}, (e, next) => {})

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
    name: 'flag',  // friendly name
    type: 'incoming',  // either incoming or outgoing
    order: 2,  // arbitrary number
    handler: flag,  // the middleware function
    module: undefined,  // the name of the module, if any
    description: '...'
  })
  bp.middlewares.register({
    name: 'devlog',  // friendly name
    type: 'incoming',  // either incoming or outgoing
    order: 3,  // arbitrary number
    handler: devlog,  // the middleware function
    module: undefined,  // the name of the module, if any
    description: '...'
  })

  // reload middlewares
  bp.middlewares.load()

  // get rid of this hello world stuff eventually...
  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|test|hey/i, (event, next) => {
    event.reply('#welcome') // See the file `content.yml` to see the block
  })
  // You can also pass a matcher object to better filter events
  bp.hear({
    type: /message|text/i,
    text: /exit|bye|goodbye|quit|done|leave|stop/i
  }, (event, next) => {
    event.reply('#goodbye', {
      // You can pass data to the UMM bloc!
      reason: 'unknown'
    })
  })

}
