'use strict'

const SESSIONS = require('./helpers/makeActiveMap')(10)

module.exports = bp => {

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
    name: 'maybeRepeat',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/makeMaybeRepeat')(SESSIONS)
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
    name: 'chooseResponse',
    type: 'incoming',
    order: 8,
    handler: require('./middlewares/makeChooseResponse')(SESSIONS)
  })
  bp.middlewares.register({
    name: 'storeOutgoing',
    type: 'outgoing',
    order: 9,
    handler: require('./middlewares/makeStoreOutgoing')(SESSIONS)
  })

  // reloading middlewares
  bp.middlewares.load()

}
