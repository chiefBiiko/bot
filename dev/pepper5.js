//
// TODO:
//   - recursion using a trampoline
//   - change levels to aims and let em provide simple obj.key patterns
//
const ops = require('./../../object-ops/index')

const pepperFactory = (func, paramNames, opts) => {
  const _args = { // argument buffer cache
    map: {},
    writes: 0,
    maybeStash(obj) {
      ops.forEach(obj, (val, key) => {
        if (ops.some(this.map, (v, k) => k === key) && 
            (opts.overwrite || !this.map[key].ready)) {
          this.map[key] = { value: val, ready: true }
        }
      })
    },
    default() {
      this.writes = 0
      this.map = paramNames.reduce((acc, cur) => {
        acc[cur] = { value: undefined, ready: false }
        return acc
      }, {})
    },
    clear(keys) {
      this.map = ops.map(_args.map, (v, k) => {
        return keys.includes(k) ? { value: undefined, ready: false } : v
      })
    }
  }
  // helpers
  const _isBoolean = x => x !== null && x !== undefined &&
    x.__proto__ === Boolean.prototype
  const _isNumber = x => x !== null && x !== undefined &&
    x.__proto__ === Number.prototype
  const _isString = x => x !== null && x !== undefined &&
    x.__proto__ === String.prototype
  const _isTruthyString = x => _isString(x) && x.length
  const _isObject = x => x && x.__proto__ === Object.prototype
  const _isArray = x => x && x.__proto__ === Array.prototype
  const _isStringArray = x => _isArray(x) && x.every(_isString)
  const _isNonEmptyArray = x => _isArray(x) && x.length
  const _isNonEmptyStringArray = x => _isNonEmptyArray(x) && x.every(_isString)
  const _isNonEmptyNumberArray = x => _isNonEmptyArray(x) && x.every(_isNumber)
  const _globsToRgx = globs => {
    return globs
      .map(v => v.replace('*', '.*').split(/\.(?!\*)/).map(s => RegExp(s)))
  }
  const _getRgxMatchedObjects = (og, aims) => {
    if (!aims.length) return [ og ]
    console.log('og', og)
    const mobs = []
    var parent = og
    var temp = null
    for (const aim of aims) {
      console.log('aim', aim)
      for (let i = 0; i < aim.length; i++) {
        temp = parent[aim[i]]
        console.log('temp', temp)
        if (i === aim.length - 1 && _isObject(temp)) mobs.push(temp)
        parent = temp
      }
      parent = og
      // const _hasRgxKey = ops.filter(parent, (v, k) => rgx.test(k))
      // if (!_hasRgxKey.length) return false
      // else parent = parent[_hasRgxKey[0]]
    }
    return mobs
  }
  // walker
  const _walkAndMaybeStash = obj => {
    ops.forEach(ops.map(ops.filter(obj, _isObject), o => {
      _args.maybeStash(o)
      return o
    }), _walkAndMaybeStash)  
    
  }
  // pepper
  const pepper = argmap => {
    if (!_isObject(argmap)) return
    if (opts.aims.map(String).some(path => path.includes('/.*/'))) {
      _walkAndMaybeStash(argmap)
    } else if (!opts.aims.length) {
      _args.maybeStash(argmap)
    } else {
      const mobs = _getRgxMatchedObjects(argmap, opts.aims)
      console.log('aims', opts.aims, 'mobs', mobs)
      mobs.forEach(_walkAndMaybeStash)      
    }
  //_walkAndMaybeStash(argmap, 0, argmap)
    if (ops.every(_args.map, v => v.ready)) {
      const z = func.apply(opts.that, ops.values(_args.map).map(v => v.value))
      _args.default()
      return z
    } else if (opts.clearEvery !== -1 && ++_args.writes >= opts.clearEvery) {
       _args.default()
    }
  }
  // pepper side methods
  pepper.clear = keys => {
    _isNonEmptyStringArray(keys) ? _args.clear(keys) : _args.default()
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
  opts.aims = _isStringArray(opts.aims) ? _globsToRgx(opts.aims) : []
  _args.default()
  return pepper
}

module.exports = pepperFactory
