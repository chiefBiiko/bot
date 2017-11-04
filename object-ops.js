const ops = {
  values(obj) {
    return Object.keys(obj).map(function(k){ return this[k] }, obj)
  },
  props(obj) {
    return Object.keys(obj).map(function(k){ return [ k, this[k] ] }, obj)
  },
  map(obj, func, that) { // func(val, key, obj)
    return this.props(obj).reduce(function(acc, cur) {
      acc[cur[0]] = func.apply(that, cur.reverse().concat(this))
      return acc
    }, {}, obj)
  },
  filter(obj, func, that) { // func(val, key, obj)
    return this.props(obj).reduce(function(acc, cur) {
      if (!func.apply(that, cur.reverse().concat(this))) delete acc[cur[1]]
      return acc
    }, obj, obj)
  },
  reduce(obj, func, init, that) { // func(acc, cur, key, obj)
    return (function step(i, acc, props, obj, func, that) {
      if (i > props.length - 1) return acc
      return step(i + 1,
                  func.call(that, acc, props[i][1], props[i][0], obj),
                  props, obj, func, that)
    })(0, init, this.props(obj), obj, func, that)
  },
  forEach(obj, func, that) { // func(val, key, obj)
    this.props(obj)
      .forEach(p => func.apply(that, p.reverse().concat(this)), obj)
  },
  every(obj, func, that) { // func(val, key, obj)
    return this.props(obj).every(p => {
      return func.apply(that, p.reverse().concat(this))
    }, obj)
  },
  some(obj, func, that) { // func(val, key, obj)
    const props = this.props(obj)
    for (const p of props) {
      if (func.apply(that, p.reverse().concat(obj))) return true
    }
    return false
  },
  randomProp(obj) {
    const props = this.props(obj)
    return props[Math.floor(Math.random() * props.length)]
  },
  randomKey(obj) {
    return this.randomProp(obj)[0]
  },
  randomVal(obj) {
    return this.randomProp(obj)[1]
  },
  hasProp(obj, key, val) {
    return this.some(obj, (v, k) => k === key && v === val)
  },
  hasKey(obj, key) {
    return obj.hasOwnProperty(key)
  },
  hasValue(obj, val) {
    return this.some(obj, v => v === val)
  },
  keysOf(obj, val) {
    return Object.keys(this.filter(obj, v => v === val))
  }
}

module.exports = Object.freeze(ops)
