'use strict'

const sentiment = require('sentiment')

module.exports = SESSIONS => {
  const rageScorer = (e, next) => {
    if (sentiment(e.text).score < 0) {
      const session = SESSIONS.get(e.user.id)
      session.convo.say('#human-support')
      return
    }
    next()
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return rageScorer
}
