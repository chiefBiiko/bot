'use strict'

// mobile view: http://localhost:3000/lite/?m=platform-webchat&v=fullscreen

const SESSIONS = require('./helpers/makeActiveMap')(10)

module.exports = bp => {

  // registering middlewares
  bp.middlewares.register({
    name: 'noop',
    type: 'incoming',
    order: 1,
    handler: (e, next) => next()
  })
  bp.middlewares.register({
    name: 'manageSessions',
    type: 'incoming', // either incoming or outgoing
    order: 2,
    handler: require('./middlewares/makeManageSessions')(bp, SESSIONS)
  })
  bp.middlewares.register({
    name: 'checkYes',
    type: 'incoming',
    order: 3,
    handler: require('./middlewares/makeCheckYes')(SESSIONS)
  })
  bp.middlewares.register({
    name: 'rageScorer',
    type: 'incoming',
    order: 4,
    handler: require('./middlewares/makeRageScorer')(SESSIONS)
  })
  bp.middlewares.register({
    name: 'tokenizeText',
    type: 'incoming',
    order: 5,
    handler: require('./middlewares/tokenizeText')
  })
  bp.middlewares.register({
    name: 'checkAgainstDB',
    type: 'incoming',
    order: 6,
    handler: require('./middlewares/makeCheckAgainstDB')(bp, 10)
  })
  bp.middlewares.register({
    name: 'flag',
    type: 'incoming',
    order: 7,
    handler: require('./middlewares/flag')
  })
  bp.middlewares.register({
    name: 'patchProductInfo',
    type: 'incoming',
    order: 8,
    handler: require('./middlewares/patchProductInfo')
  })
  bp.middlewares.register({
    name: 'devlog',
    type: 'incoming',
    order: 9,
    handler: require('./middlewares/devlog')
  })
  bp.middlewares.register({
    name: 'chooseResponse',
    type: 'incoming',
    order: 10,
    handler: require('./middlewares/makeChooseResponse')(SESSIONS)
  })

  // reloading middlewares
  bp.middlewares.load()

}
