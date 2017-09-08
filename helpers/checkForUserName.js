'use strict'

const replaceOrNull = require('./replaceOrNull')
const toTitleCase = require('./toTitleCase')

module.exports = text => {
  const matched =
    replaceOrNull(text, /^.*my\s+name\s+is\s+([a-z]+).*$/, '$1') ||
      replaceOrNull(text, /^.*i +am +([a-z]+).*$/, '$1')
  return matched !== null ? toTitleCase(matched) : ''
}
