'use strict'

const replaceOrNull = require('./replaceOrNull')
const toTitleCase = require('./toTitleCase')

module.exports = text => {
  const matched =
    replaceOrNull(text, /^.*my\s*name\s*is\s*([a-z]+).*$/i, '$1') ||
      replaceOrNull(text, /^.*i\s*am\s*([a-z]+).*$/i, '$1')
  return matched !== null ? toTitleCase(matched) : ''
}
