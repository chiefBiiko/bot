'use strict'

const nlpOk = require('compromise')

module.exports = (e, next) => {

  next()
  return e // 4 dev tests only; ignored by botress
}
