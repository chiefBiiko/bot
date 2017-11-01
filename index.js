//
// TODO: 
//   - recursion using a trampoline
//   - change levels to aims and let em provide simple obj.key patterns
//
const pepperFactory = (func, paramNames, opts) => {
  const _args = { 
    map : {},
    default: () => paramNames.reduce((acc, cur) => {
      acc[cur] = { value: undefined, ready: false }
      return acc
    }, {})
  }
  const _isNumber = x => typeof x === 'number' || x instanceof Number
  const _isObject = x => 
    x !== null && x !== undefined && x.__proto__ === Object.prototype
  const _walkAndMaybeStash = (x, n) => {
    if (!opts.levels.includes(-1) && n > Math.max(...opts.levels)) return
    Object.keys(x)
      .map(key => [ key, x[key] ])
      .map(([ key, val ]) => {
        if ((opts.levels.includes(-1) || opts.levels.includes(n)) &&
            _args.map.hasOwnProperty(key) && 
            (opts.overwrite || !_args.map[key].ready)) {
          _args.map[key] = { value: val, ready: true }
        }
        return val
      })
      .filter(_isObject)
      .forEach(obj => _walkAndMaybeStash(obj, n + 1))
  }
  var _input_countr = 0
  const pepper = argmap => {
    if (!_isObject(argmap)) return
    _walkAndMaybeStash(argmap, 0)
    if (Object.keys(_args.map).every(key => _args.map[key].ready)) {
      const rtn = 
        func.apply(opts.thisArg, 
                   Object.keys(_args.map).map(key => _args.map[key].value))
      _args.map = _args.default()
      _input_countr = 0
      return rtn
    } else if (opts.clearEvery !== -1 && ++_input_countr >= opts.clearEvery) {
      _args.map = _args.default()
      _input_countr = 0
    }
  }
  pepper.clear = keys => {
    if (!keys || !Array.isArray(keys) || !keys.length) {
      _args.map = _args.default()
      _input_countr = 0
    } else {
      keys.forEach(key => {
        if (_args.map.hasOwnProperty(key))
          _args.map[key] = { value: undefined, ready: false }
      })
    }
  }
  pepper.getArgMap = () => _args.map
  pepper.getConfig = () => ({ func: func, paramNames: paramNames, opts: opts })
  if (!_isObject(opts)) opts = {}
  if (!opts.thisArg) opts.thisArg = null 
  if (![ true, false ].includes(opts.overwrite)) opts.overwrite = false
  if (!Array.isArray(opts.levels) || 
      !opts.levels.length || 
      !opts.levels.every(_isNumber))
    opts.levels = [ 0 ]
  opts.clearEvery = _isNumber(opts.clearEvery) ? 
    Math.floor(opts.clearEvery) : -1
  _args.map = _args.default()
  return pepper
}

module.exports = pepperFactory