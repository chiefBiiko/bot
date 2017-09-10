'use strict'

module.exports = SESSIONS => {
  const storeOutgoing = (e, next) => {
    // const session = SESSIONS.get(e.user.id)
    // session.last_outgoing = e.text
    // SESSIONS.set(e.user.id, session)
    // console.log(session.last_outgoing)
    next()
    return e // 4 dev tests only; ignored by botress
  }
  return storeOutgoing
}
