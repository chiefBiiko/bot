'use strict'

const checkForUserName = require('./../helpers/checkForUserName')

module.exports = (bp, SESSIONS) => {
  const manageSessions = (e, next) => { // closes over bp and SESSIONS
    const first_name = checkForUserName(e.text)
    if (!SESSIONS.has(e.user.id)) {
      const convo = bp.convo.start(e, convo => { // start a new conversation...
        convo.say('#welcome', { first_name: first_name })
      })
      SESSIONS.set(e.user.id, { // ...and store it
        convo: convo,
        first_name: first_name,
        last_query: e.text,
        last_stamp: new Date().getTime()
      })
    } else { // existing session
      const session = SESSIONS.get(e.user.id)
      if (first_name) {
        session.first_name = first_name
      }
      session.last_query = e.text,
      session.last_stamp = new Date().getTime()
      if (/hi|hallo|hello|hey/i.test(e.text)) {
        session.convo.say('#welcome-again', { first_name: first_name })
        return
      }
      SESSIONS.set(e.user.id, session)
      next()
    }
    return e // 4 dev tests only, ignored by botpress
  }
  // return a closure
  return manageSessions
}
