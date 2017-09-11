'use strict'

module.exports = SESSIONS => {
  const repeatOutgoing = (e, next) => {
    if (RegExp('say\\s*that\\s*again|come\\s*again|repeat\\s*that|what\\?', 'i')
          .test(e.text)) {
      const session = SESSIONS.get(e.user.id)
      session.convo.say('#repeat', { last_outgoing: session.last_outgoing })
      return
    }
    next()
    return e // 4 dev tests only; ignored by botress
  }
  // returning a closure
  return repeatOutgoing
}
