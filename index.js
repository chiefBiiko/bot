'use strict'

//const andFmtArr = require('./helpers/andFmtArr')
const SESSIONS = require('./helpers/makeActiveMap')(10)

module.exports = bp => {

  // assemble e.flags to actions with conditions object!!! UMM and stuff...
  // see how to make good use of bp.convo AND what happened to outgoing???
  // all the hear handlers: always send over existing convo!!!
  // move to outgoing!!!

  // make one hear handler that checks there is an exact product and then if else to supply the correct rreply!!!!
  // exact product and attribute except rating
  bp.hear({
    text: /.+/
    // stash: obj => Object.keys(obj.hitProducts).length !== 0 // GOOD
  }, (e, next) => {
    const session = SESSIONS.get(e.user.id)
    if (Object.keys(e.stash.hitProducts).length !== 0) {
      Object.keys(e.stash.hitProducts).forEach(pname => {
        session.convo.say('#hit-product', {
          patch: e.stash.hitProducts[pname].patch
        })
      })
    } else if (e.stash.approxProducts.length !== 0) {
      session.convo.say('#assert-product', {
        product: e.stash.approxProducts[0]
      })
    } else if (e.stash.exactCategories.length !== 0) {
      session.convo.say('#hit-category', {
        category: e.stash.exactCategories[0]
      })
    } else if (e.stash.approxCategories.length !== 0) {
      session.convo.say('#assert-category', {
        category: e.stash.approxCategories[0]
      })
    } else {
      session.convo.say('#fallback')
    }
    // e.reply('#exact-product-feature', { // TODO
    //   product: 'noop'//e.exactProduct[0]
    // //,features: andFmtArr(DB[e.exactProduct[0]].features)//DB[e.exactProduct[0]].features.join(', ')
    // })

    // cases !!!!!!!
    // -if any of e.flags.wantsFeatures, e.flags.wantsPictures, e.flags.wantsPrice
    // -exact product and rating --- only consider mapping requests with ratings
    // -exact product only



  //next()
  })



  // // exact product and picture
  // bp.hear({
  //   exactProduct: arr => arr.length !== 0,
  //   stash: obj => obj.wantsPicture
  // }, (e, next) => {
  //   e.reply('#exact-product-picture', {
  //     product: e.exactProduct[0]
  //   //,pictures: andFmtArr(DB[e.exactProduct[0]].pictures)//DB[e.exactProduct[0]].pictures.join(', ')
  //   })
  // //next()
  // })
  //
  // // exact product and price
  // //...
  //
  // // exact product and rating
  // //...
  //
  // // exact product only
  // bp.hear({ exactProduct: arr => arr.length !== 0 }, function(e, next) {
  //   e.reply('#exact-product-only', { product: e.exactProduct[0] })
  // //next()
  // })
  //
  // // approx product only
  // // send y/n button along n send 2 #exact-product-only if y
  // bp.hear({ approxProduct: arr => arr.length !== 0 }, function(e, next) {
  //   e.reply('#approx-product-only', { product: e.approxProduct[0] })
  // //next()
  // })
  //
  // // exact category only
  // //...
  //
  // // approx category only
  // //...

  // registering middlewares
  bp.middlewares.register({
    name: 'tokenizeText', // friendly name
    type: 'incoming', // either incoming or outgoing
    order: 1, // arbitrary number
    handler: require('./middlewares/tokenizeText') // the middleware f
  })
  bp.middlewares.register({
    name: 'manageSessions',
    type: 'incoming',
    order: 2,
    handler: require('./middlewares/makeManageSessions')(bp, SESSIONS)
  })
  bp.middlewares.register({
    name: 'checkAgainstDB',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/makeCheckAgainstDB')(bp, 1)
  })
  bp.middlewares.register({
    name: 'flag',
    type: 'incoming',
    order: 4,
    handler: require('./middlewares/flag')
  })
  bp.middlewares.register({
    name: 'patchProductInfo',
    type: 'incoming',
    order: 5,
    handler: require('./middlewares/patchProductInfo')
  })
  bp.middlewares.register({
    name: 'devlog',
    type: 'incoming',
    order: 6,
    handler: require('./middlewares/devlog')
  })
  bp.middlewares.register({
    name: 'normalizeText',
    type: 'outgoing',
    order: 7,
    handler: require('./middlewares/normalizeText')
  })

  // reload middlewares
  bp.middlewares.load()

}
