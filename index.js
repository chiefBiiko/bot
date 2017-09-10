'use strict'

const SESSIONS = require('./helpers/makeActiveMap')(10)

module.exports = bp => {

  bp.hear({ text: /.+/ }, (e, next) => {
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
    next()
  })

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
    name: 'makeRepeatOutgoing',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/makeRepeatOutgoing')(SESSIONS)
  })
  bp.middlewares.register({
    name: 'checkAgainstDB',
    type: 'incoming',
    order: 4,
    handler: require('./middlewares/makeCheckAgainstDB')(bp, 1)
  })
  bp.middlewares.register({
    name: 'flag',
    type: 'incoming',
    order: 5,
    handler: require('./middlewares/flag')
  })
  bp.middlewares.register({
    name: 'patchProductInfo',
    type: 'incoming',
    order: 6,
    handler: require('./middlewares/patchProductInfo')
  })
  bp.middlewares.register({
    name: 'devlog',
    type: 'incoming',
    order: 7,
    handler: require('./middlewares/devlog')
  })
  bp.middlewares.register({
    name: 'storeOutgoing',
    type: 'outgoing',
    order: 8,
    handler: require('./middlewares/makeStoreOutgoing')(SESSIONS)
  })

  // reload middlewares
  bp.middlewares.load()

}
