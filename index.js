const ops = require('pojo-ops')
const be = require('./be')
const is = {
  boolean: be.boolean,
  uInt: x => be.number(x) && x >= 0 && x % 1 === 0,
  plainObject: be.plainObject,
  nonEmptyStringArray: x => be.array(x) && x.length && x.every(be.string)
}

module.exports = function pepperFactory(func, paramNames, opts) {
  const trap = { // internal
    stash: {},
    calls: 0,
    globsToRgx(globs) {
      return globs.map(v => v.replace('*', '.*').split(/\.(?!\*)/))
    },
    getRgxMatchedObjects(og, aims) {
      if (!aims.length) return [ og ]
      const mobs = []
      for (const aim of aims) {
        let parent = og, i = 0, hitz = [], temp = null
        while (i < aim.length) {
          hitz = Object.keys(parent).filter(k => RegExp(aim[i]).test(k))
          if (!hitz.length) break
          temp = parent[hitz[0]]
          if (!is.plainObject(temp)) break
          else if (i === aim.length - 1) mobs.push(temp)
          parent = temp
          i++
        }
      }
      return mobs
    },
    walkAndMaybeStash(obj) { // depth-first walker
      ops.forEach(ops.map(ops.filter(obj, is.plainObject), o => {
        trap.maybeStash(o)
        trap.walkAndMaybeStash(o)
        return o
      }), trap.walkAndMaybeStash)
    },
    maybeStash(obj) {
      ops.forEach(obj, (val, key) => {
        if (ops.hasKey(this.stash, key) &&
            (opts.overwrite || !this.stash[key].ready))
          this.stash[key] = { value: val, ready: true }
      })
    },
    zero() {
      this.calls = 0
      this.stash = paramNames.reduce((acc, cur) => {
        acc[cur] = { value: undefined, ready: false }
        return acc
      }, {})
    },
    clear(keys) {
      this.stash = ops.map(this.stash, (v, k) => {
        return keys.includes(k) ? { value: undefined, ready: false } : v
      })
    }
  }
  // factory assembly
  function pepper(input) {
    if (is.plainObject(input)) {
      if (opts.aims.some(path => path.includes('.*'))) {
        trap.walkAndMaybeStash(input)
      } else if (!opts.aims.length) {
        trap.maybeStash(input)
      } else {
        const mobs = trap.getRgxMatchedObjects(input, opts.aims)
        mobs.forEach(trap.maybeStash.bind(trap))
      }
      if (ops.every(trap.stash, v => v.ready)) {
        const temp = trap.stash
        trap.zero()
        return func.apply(opts.that, ops.values(temp).map(a => a.value))
      }
    }
    if (opts.clearEvery && ++trap.calls >= opts.clearEvery) trap.zero()
  }
  // pepper side methods
  pepper.getConfig = () => ({ func: func, paramNames: paramNames, opts: opts })
  pepper.getStash = () => trap.stash
  pepper.clear = keys =>
    is.nonEmptyStringArray(keys) ? trap.clear(keys) : trap.zero()
  // defaults
  if (!is.plainObject(opts)) opts = {}
  if (!opts.that) opts.that = null
  if (!is.boolean(opts.overwrite)) opts.overwrite = false
  if (!is.uInt(opts.clearEvery)) opts.clearEvery = 0
  opts.aims =
    is.nonEmptyStringArray(opts.aims) ? trap.globsToRgx(opts.aims) : []
  trap.zero()
  // factory return
  return pepper
}
