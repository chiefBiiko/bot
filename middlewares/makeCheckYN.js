module.exports = SESSIONS => {
  const checkYN = (e, next) => {
    
    next()
    return e // 4 dev tests only, ignored by botpress
  }
  // returning a closure
  return checkYN
}
