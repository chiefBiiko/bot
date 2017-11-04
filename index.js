const ops = require('./object-ops')

const pepperFactory = (func, paramNames, opts) => {
  const _args = {
    map: {}, // cache
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
  const _isObject = x => x && x.__proto__ === Object.prototype
  const _isBoolean = x =>
    x !== null && x !== undefined && x.__proto__ === Boolean.prototype
  const _isUInt = x =>
    x !== null && x !== undefined && x.__proto__ === Number.prototype &&
    x >= 0 && x % 1 === 0
  const _isString = x =>
    x !== null && x !== undefined && x.__proto__ === String.prototype
  const _isNonEmptyArray = x => Array.isArray(x) && x.length
  const _isNonEmptyStringArray = x => _isNonEmptyArray(x) && x.every(_isString)
  const _globsToRgx = globs => {
    return globs
      .map(v => v.replace('*', '.*').split(/\.(?!\*)/).map(s => RegExp(s)))
  }
  const _getRgxMatchedObjects = (og, aims) => {
    if (!_isObject(og)) return []
    else if (!_isNonEmptyArray(aims)) return [ og ]
    const mobs = []
    for (const aim of aims) {
      let parent = og, i = 0, hitz = [], temp = null
      while (i < aim.length) {
        hitz = Object.keys(parent).filter(k => aim[i].test(k))
        if (!_isNonEmptyArray(hitz)) break
        temp = parent[hitz[0]]
        if (!_isObject(temp)) break
        else if (i === aim.length - 1) mobs.push(temp)
        parent = temp
        i++
      }
    }
    return mobs
  }
  // walker - depth-first search -
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
      mobs.forEach(leaf => _args.maybeStash(leaf))
    }
    if (ops.every(_args.map, v => v.ready)) {
      const z = func.apply(opts.that, ops.values(_args.map).map(v => v.value))
      _args.default()
      return z
    } else if (opts.clearEvery !== 0 && ++_args.writes >= opts.clearEvery) {
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
  opts.aims = _isNonEmptyStringArray(opts.aims) ? _globsToRgx(opts.aims) : []
  opts.clearEvery = _isUInt(opts.clearEvery) ? opts.clearEvery : 0
  _args.default()
  return pepper
}

module.exports = pepperFactory
