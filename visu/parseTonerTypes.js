'use strict'

module.exports = text => {
  if (/colou?r|ymc/i.test(text)) {
    return 'ymc'
  } else if (/black/i.test(text)) {
    return 'k'
  } else {
    return null
  }
}