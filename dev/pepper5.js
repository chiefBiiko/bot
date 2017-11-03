//
// TODO:
//   - recursion using a trampoline
//   - change levels to aims and let em provide simple obj.key patterns
//
const ops = require('./../../object-ops/object-ops')

const pepperFactory = (func, paramNames, opts) => {
  const _args = { // argument buffer cache
    map : {},
    default() {
      return paramNames.reduce((acc, cur) => {
        acc[cur] = { value: undefined, ready: false }
        return acc
      }, {})
    }
  }
  // helpers
  const _isBoolean = x => x && x.__proto__ === Boolean.prototype  
  const _isNumber = x => x && x.__proto__ === Number.prototype
  const _isString = x => x && x.__proto__ === String.prototype
  const _isTruthyString = x => _isString(x) && x.length
  const _isObject = x => x && x.__proto__ === Object.prototype
  const _isArray = x => x && x.__proto__ === Array.prototype
  const _isNonEmptyArray = x => x && x.__proto__ === Array.prototype && x.length
  const _isNonEmptyNumberArray = x =>
    x && x.__proto__ === Array.prototype && x.length && x.every(_isNumber)
  const _isNonEmptyStringArray = x =>
    x && x.__proto__ === Array.prototype && x.length && x.every(_isString)
  // walker
  const _walkAndMaybeStash = (obj, n) => {
    if (!opts.levels.includes(-1) && n > Math.max(...opts.levels)) return
    // Object.keys(x)
    //   .filter(key => opts.restrict ? !opts.restrict.test(key) : true)
    //   .map(key => [ key, x[key] ])
      ops.props(obj)
    //.filter(([ key, val ]) => opts.aims ? !opts.aims.test(key) : true)
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
  // pepper
  const pepper = argmap => {
    if (!_isObject(argmap)) return
    _walkAndMaybeStash(argmap, 0)
    if (Object.keys(_args.map).every(key => _args.map[key].ready)) {
      const rtn =
        func.apply(opts.that,
                   Object.keys(_args.map).map(key => _args.map[key].value))
      _args.map = _args.default()
      _input_countr = 0
      return rtn
    } else if (opts.clearEvery !== -1 && ++_input_countr >= opts.clearEvery) {
      _args.map = _args.default()
      _input_countr = 0
    }
  }
  // pepper side methods
  pepper.clear = keys => {
    if (!keys || !_isArray(keys) || !keys.length) {
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
  // defaults
  if (!_isObject(opts)) opts = {}
  if (!opts.that) opts.that = null
  if (!_isBoolean(opts.overwrite)) opts.overwrite = false
  if (!_isNonEmptyNumberArray(opts.levels)) opts.levels = [ 0 ]
  opts.clearEvery = _isNumber(opts.clearEvery) ?
    Math.floor(opts.clearEvery) : -1
  opts.aims = _isString(opts.aims) && opts.aims.length ?
    new RegExp(opts.aims) : null
  _args.map = _args.default()
  return pepper
}

module.exports = pepperFactory
