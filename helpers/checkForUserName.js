const replaceOrNull = require('./replaceOrNull')
const toTitleCase = require('./toTitleCase')

module.exports = text => {
  const matched =
    replaceOrNull(text, /^.*my\s+name\s+is\s+([a-z]+).*$/, '$1') ||
      replaceOrNull(text, /^.*(i('|`|´)?m)|^.*(i\s+am)\s+([a-z]+).*$/, '$4')
  return matched !== null ? toTitleCase(matched) : ''
}
