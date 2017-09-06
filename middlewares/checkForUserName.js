const replaceOrNull = require('./../helpers/replaceOrNull')
const toTitleCase = require('./../helpers/toTitleCase')

module.exports = (e, next) => { // incoming, order: 3
  const matched =
    replaceOrNull(e.text, /^.*my\s+name\s+is\s+([a-z]+).*$/, '$1') ||
      replaceOrNull(e.text, /^.*(i('|`|´)?m)|^.*(i\s+am)\s+([a-z]+).*$/, '$4')
  e.user.first_name = matched !== null ? toTitleCase(matched) : ''
  next()
}
