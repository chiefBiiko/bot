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

const natural = require('natural')

module.exports = function(bp) {

  const PP = {  // preprocessing stuff bundled
    LEVEN: 3,  // Levenshtein distance approximation cutoff
    wordTokenizer: new natural.WordTokenizer()  // std english word tokenizer
  }

  function lowerCaseAndTokenize(e, next) {  // incoming order: 1
    e.text = e.text.toLowerCase()
    e.tokens = PP.wordTokenizer.tokenize(e.text)
    console.log(`tokens: ${e.tokens}`)
    next()
  }

  function brandmarkQuery(e, next) {  // incoming order: 2
    bp.db.kvs.get('products').then(products => {  // products: fake db
      // db subsets
      const pnames = Object.keys(products)
      const cnames = [ ...new Set(pnames.map(pn => products[pn].category)) ]
      // detecting product query
      e.exactProduct = pnames.filter(pn => e.text.includes(pn))
      e.approxProduct = e.exactProduct.length ? [] :
        pnames.filter(pn => {
          return e.tokens.some(t => {
            return natural.LevenshteinDistance(t, pn) <= PP.LEVEN
          })
        })
      // detecting category query
      e.exactCategory = cnames.filter(cn => e.text.includes(cn))
      e.approxCategory = e.exactCategory.length ? [] :
        cnames.filter(cn => {
          return e.tokens.some(t => {
            return natural.LevenshteinDistance(t, cn) <= PP.LEVEN
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

      console.log(`exactProduct: ${e.exactProduct}\n` +
                  `approxProduct: ${e.approxProduct}\n` +
                  `exactCategory: ${e.exactCategory}\n` +
                  `approxCategory: ${e.approxCategory}\n` +
                  `requestsFeatures: ${e.requestsFeature}\n` +
                  `requestsPictures: ${e.requestsPicture}\n` +
                  `requestsPrice: ${e.requestsPrice}\n` +
                  `requestsRating: ${e.requestsRating}\n` +
                  `requestsMin: ${e.requestsMin}\n` +
                  `requestsMax: ${e.requestsMax}\n` +
                  `requestsAvg: ${e.requestsAvg}\n` +
                  `requestsDif: ${e.requestsDif}`)

      next()
    }).catch(console.error)
  }

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
    name: 'brandmarkQuery',  // friendly name
    type: 'incoming',  // either incoming or outgoing
    order: 2,  // arbitrary number
    handler: brandmarkQuery,  // the middleware function
    module: undefined,  // the name of the module, if any
    description: '...'
  })

  // reload middlewares
  bp.middlewares.load()

// assemble e.flags to actions with conditions object!!!
//bp.hear({...}, (e, next) => {})

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
