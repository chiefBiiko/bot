// func: Function any js function
// params: string[] of the names of all required parameters in the same order as
// they appear in func's signature!
const pepperFactory = (func, paramNames, thisArg) => {
  const _argmap = paramNames.reduce((acc, cur) => {
    acc[cur] = { value: undefined, ready: false }
    return acc
  }, {})
  const pepper = argmap => {
    pepper.peppering = true
    Object.keys(argmap)
      .filter(key => _argmap.hasOwnProperty(key))
      .forEach(key => _argmap[key] = { value: argmap[key], ready: true })
    return Object.keys(_argmap).every(key => _argmap[key].ready) ?
      func.apply(thisArg, Object.keys(_argmap).map(key => _argmap[key].value)) :
        pepper
  }
  return pepper
}

module.exports = pepperFactory