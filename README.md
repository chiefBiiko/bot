# pepper

[![build status](http://img.shields.io/travis/chiefBiiko/pepper-factory.svg?style=flat)](http://travis-ci.org/chiefBiiko/pepper-factory)

***

*Peppering* describes a technique that allows to assemble a function call incrementally, supplying arguments in any arbitrary order, by name. A *peppering function* returns `undefined` if there are remaining undefined parameters to the *peppered function*. A *peppering function* returns the evaluated *peppered function* once arguments to all required parameters of the *peppered function* have been supplied. It is closely related to *autocurrying* but revolves around a *peppering function* that identifies parameter-argument bindings by name rather than by order. To that end, arguments to the *peppering function* are supplied in the form of an arguments object.

This approach allows to supply a function's arguments incrementally and in an arbitrary order, not necessarily the parameter order of the function's signature. Useful for dynamically building function calls, fx from incremental user input.

***

## Usage

*Pepper* a function by passing it to the `pepperFactory` alongside an array that lists its parameter names in the same order as they appear in the function's signature. 

```js
const pepperFactory = require('pepper-factory')
const stringify = (a, b, c) => `a:${a}, b:${b}, c:${c}`
const pepper = pepperFactory(stringify, [ 'a', 'b', 'c' ], {})

pepper({ c: 77 }) // -> undefined
pepper({ a: 36 }) // -> undefined
pepper({ b: 44 }) // -> 'a:36, b:44, c:77'
```

*Peppering* behavior can be tweaked by setting some options.

***

## API

### `const pepper = pepperFactory(func, paramNames, opts)`

Make a *peppering* a function.

+ `func` Function **required**
+ `paramNames` string[] **required**
+ `opts` Object **optional**

`opts` defaults to:

```js
{
  // opts.levels: number[]
  // match obj.keys at these (nested) levels, [ -1 ] indicates anywhere
  levels: [ 0 ],
  // opts.overwrite: boolean
  // overwrite previously stored argument matches?
  overwrite: false,
  // clearEvery: number
  // clear stored argument matches after every N calls, -1 indicates never
  clearEvery: -1,
  // thisArg: any
  // this when evaluating func
  thisArg: null
}
```
**Return** Function

### `pepper(Object)`

*Pepper* towards a function evaluation by passing it an arguments object that has keys that equal parameter names.

Anything but an object or non-matching object keys are just ignored.

**Return** any

### `pepper.clear([string[]])`

Manually clear stored arguments.

If called with an array of keys to clear, only the indicated argument values are cleared, otherwise all.

**Return** undefined

### `pepper.getArgMap()`

Get the internal arguments object.

**Return** Object

### `pepper.getConfig()`

Get an configurations object that includes all defined and defaulted arguments of `pepperFactory`.

**Return** Object

***

## License

MIT