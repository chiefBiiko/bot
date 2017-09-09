'use strict'

module.exports = (e, next) => {
  console.log(JSON.stringify(e))
  next()
  return e // 4 dev tests only; ignored by botress
}
