const pepperFactory =
  (func, paramNames, searchDepth, overwrite, clearAfter, thisArg) => {
  const _args = { 
    map : {},
    default: () => paramNames.reduce((acc, cur) => {
      acc[cur] = { value: undefined, ready: false }
      return acc
    }, {})
  }
  const _walkAndMaybeStash = (x, n) => {
    if (!searchDepth.includes(-1) && n > Math.max(...searchDepth)) return
    Object.keys(x)
      .map(key => [ key, x[key] ])
      .map(([ key, val ]) => {
        if ((searchDepth.includes(-1) || searchDepth.includes(n)) &&
            _args.map.hasOwnProperty(key) && 
            (overwrite || !_args.map[key].ready)) {
          _args.map[key] = { value: val, ready: true }
        }
        return val
      })
      .filter(val => val !== null && val.__proto__ === Object.prototype)
      .forEach(obj => _walkAndMaybeStash(obj, ++n))
  }
  var _input_countr = 0
  const pepper = argmap => {
    if (!argmap || argmap.__proto__ !== Object.prototype) return
    _walkAndMaybeStash(argmap, 0)
    if (Object.keys(_args.map).every(key => _args.map[key].ready)) {
      const rtn = 
        func.apply(thisArg, 
                   Object.keys(_args.map).map(key => _args.map[key].value))
      _args.map = _args.default()
      _input_countr = 0
      return rtn
    } else if (clearAfter !== -1 && ++_input_countr >= clearAfter) {
      _args.map = _args.default()
      _input_countr = 0
    }
  }
  pepper.clear = keys => {
    if (!keys || !Array.isArray(keys) || !keys.length)
      _args.map = _args.default()
    else
      keys.forEach(key => {
        if (_args.map.hasOwnProperty(key))
          _args.map[key] = { value: undefined, ready: false }
      })
    _input_countr = 
      Object.keys(_args.map)
        .map(key => _args.map[key])
        .reduce((acc, cur) => acc += cur.ready ? 1 : 0, 0)
  }
  pepper.getArgMap = () => _args.map
  pepper.getConfig = () => { 
    return { 
      func: func, 
      paramNames: paramNames,
      searchDepth: searchDepth,
      overwrite: overwrite,
      clearAfter: clearAfter,
      thisArg: thisArg 
    }
  }
  if (!Array.isArray(searchDepth) || !searchDepth.length) searchDepth = [ 0 ]
  if (![ true, false ].includes(overwrite)) overwrite = false
  if (typeof clearAfter !== 'number' && !clearAfter instanceof Number)
    clearAfter = -1
  _args.map = _args.default()
  return pepper
}

module.exports = pepperFactory