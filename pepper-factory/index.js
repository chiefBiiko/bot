// func: Function any js function
// params: string[] of the names of all required parameters in the same order as
// they appear in func's signature!
const pepperFactory = (func, paramNames, thisArg) => {
  const _args = { 
    map : {},
    default: () => paramNames.reduce((acc, cur) => {
      acc[cur] = { value: undefined, ready: false }
      return acc
    }, {}) 
  }
  const pepper = argmap => {
    if (!argmap) return
    Object.keys(argmap)
      .filter(key => _args.map.hasOwnProperty(key))
      .forEach(key => _args.map[key] = { value: argmap[key], ready: true })
    if (Object.keys(_args.map).every(key => _args.map[key].ready)) {
      const rtn = 
        func.apply(thisArg, 
                   Object.keys(_args.map).map(key => _args.map[key].value))
      _args.map = _args.default()
      return rtn
    }
  }
  _args.map = _args.default()
  return pepper
}

module.exports = pepperFactory