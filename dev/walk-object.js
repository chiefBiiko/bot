// traverse an object applying func to every object met
function walkObjectNodes(obj, func) {
  func(obj)
  Object.keys(obj)
    .map(k => obj[k])
    .filter(v => v && v.__proto__ === Object.prototype)
    .forEach(o => walkObjectNodes.call(obj, o, func))
}

module.exports = walkObjectNodes
