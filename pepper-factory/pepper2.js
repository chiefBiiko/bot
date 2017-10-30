const pepperFactory = (func, paramNames, searchDepth, overwrite, thisArg) => {
  const _args = { 
    map : {},
    default: () => paramNames.reduce((acc, cur) => {
      acc[cur] = { value: undefined, ready: false }
      return acc
    }, {}),
    maybeStash: props => {
      props
        .filter(([ key, val ]) => _args.map.hasOwnProperty(key))
        .forEach(([ key, val ]) => _args.map[key] = { value: val, ready: true }) 
    } 
  }
  const _walkAndMaybeStash = (x, n) => {
    if (!searchDepth.includes(-1) && n > Math.max(...searchDepth)) return
    Object.keys(x)
      .map(key => [ key, x[key] ])
      .map(([ key, val ]) => {
        if (searchDepth.includes(-1) || searchDepth.includes(n)) {
          _args.maybeStash([ [ key, val ] ])
        }
        return val
      })
      .filter(val => val !== null && val.__proto__ === Object.prototype)
      .forEach(obj => _walkAndMaybeStash(obj, ++n))
  }
  const pepper = argmap => {
    if (!argmap || argmap.__proto__ !== Object.prototype) return
    _walkAndMaybeStash(argmap, 0)
  //console.log(_args.map)
    if (Object.keys(_args.map).every(key => _args.map[key].ready)) {
      const rtn = 
        func.apply(thisArg, 
                   Object.keys(_args.map).map(key => _args.map[key].value))
      _args.map = _args.default()
      return rtn
    }
  }
  if (!Array.isArray(searchDepth) || !searchDepth.length) searchDepth = [ 0 ]
  if (![ true, false ].includes(overwrite)) overwrite = false
  _args.map = _args.default()
  return pepper
}

module.exports = pepperFactory