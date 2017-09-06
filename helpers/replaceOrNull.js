module.exports = function replaceOrNull(string, find, replace) {
  const replaced = string.replace(find, replace)
  return replaced !== string ? replaced : null
}
