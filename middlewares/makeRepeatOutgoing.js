'use strict'

module.exports = SESSIONS => {
  const repeatOutgoing = (e, next) => {
    // if (/(say that again)|(come again)|(repeat that)|(what\?)/i.test(e.text)) {
    //   const session = SESSIONS.get(e.user.id)
    //   session.convo.say('#repeat', { last_outgoing: session.last_outgoing })
    //   return
    // }
    next()
    return e // 4 dev tests only; ignored by botress
  }
  return repeatOutgoing
}
