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
      .forEach(([ key, val ]) => {
        if (searchDepth.includes(-1) || searchDepth.includes(n)) {
          _args.maybeStash([ [ key, val ] ])
        }
        _walkAndMaybeStash(val, ++n)
      }) 
  }
  const pepper = argmap => {
    if (!argmap) return
    if (!searchDepth || searchDepth === [ 0 ]) {
      _args.maybeStash(Object.keys(argmap).map(key => [ key, argmap[key] ]))
    } else if (Array.isArray(searchDepth)) {
      _walkAndMaybeStash(argmap, 0)  
    }
    if (Object.keys(_args.map).every(key => _args.map[key].ready)) {
      const rtn = 
        func.apply(thisArg, 
                   Object.keys(_args.map).map(key => _args.map[key].value))
      _args.map = _args.default()
      return rtn
    }
  }
  if (!Array.isArray(searchDepth) || !searchDepth.length) searchDepth = [ -1 ]
  if (![ true, false ].includes(overwrite)) overwrite = false
  _args.map = _args.default()
  return pepper
}

module.exports = pepperFactory