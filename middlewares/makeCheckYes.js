module.exports = SESSIONS => {
  const checkYes = (e, next) => {
    const session = SESSIONS.get(e.user.id)
    if (session.onyes && /^\s*(yes|yea|ya|y)\s*$/i.test(e.text)) {
        e.text = session.onyes
    }
    session.onyes = ''
    SESSIONS.set(e.user.id, session)
    next()
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return checkYes
}
