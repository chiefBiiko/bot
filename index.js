'use strict'

const andFmtArr = require('./helpers/andFmtArr')
const SESSIONS = require('./helpers/makeSessionMap')(10)

module.exports = bp => {

  // assemble e.flags to actions with conditions object!!! UMM and stuff...
  // see how to make good use of bp.convo AND what happened to outgoing???
  // all the hear handlers: always send over existing convo!!!
  // move to outgoing!!!

  // exact product and feature
  bp.hear({
    exactProduct: arr => arr.length !== 0,
    stash: obj => obj.wantsFeature
  }, (e, next) => {
    e.reply('#exact-product-feature', {
      product: e.exactProduct[0]
    //,features: andFmtArr(DB[e.exactProduct[0]].features)//DB[e.exactProduct[0]].features.join(', ')
    })
  //next()
  })

  // exact product and picture
  bp.hear({
    exactProduct: arr => arr.length !== 0,
    stash: obj => obj.wantsPicture
  }, (e, next) => {
    e.reply('#exact-product-picture', {
      product: e.exactProduct[0]
    //,pictures: andFmtArr(DB[e.exactProduct[0]].pictures)//DB[e.exactProduct[0]].pictures.join(', ')
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

  // exact category only
  //...

  // approx category only
  //...

  // registering middlewares
  bp.middlewares.register({
    name: 'lowerCaseAndTokenize', // friendly name
    type: 'incoming', // either incoming or outgoing
    order: 1, // arbitrary number
    handler: require('./middlewares/lowerCaseAndTokenize'), // the middleware f
    module: undefined, // the name of the module, if any
    description: '...'
  })
  bp.middlewares.register({
    name: 'manageSessions',
    type: 'incoming',
    order: 2,
    handler: require('./middlewares/makeManageSessions')(bp, SESSIONS),
    module: undefined,
    description: '...'
  })
  bp.middlewares.register({
    name: 'checkAgainstDB',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/makeCheckAgainstDB')(bp, 1),
    module: undefined,
    description: '...'
  })
  bp.middlewares.register({
    name: 'devlog',
    type: 'incoming',
    order: 4,
    handler: require('./middlewares/devlog'),
    module: undefined,
    description: '...'
  })

  // reload middlewares
  bp.middlewares.load()

}
