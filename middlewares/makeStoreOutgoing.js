'use strict'

module.exports = SESSIONS => {
  const storeOutgoing = (e, next) => {
    const session = SESSIONS.get(e.user.id)
    session.last_outgoing = e.text
    SESSIONS.set(e.user.id, session)
    next()
    return e // 4 dev tests only; ignored by botress
  }
  // returning a closure
  return storeOutgoing
}
