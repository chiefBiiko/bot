# pepper-factory

[![build status](http://img.shields.io/travis/chiefbiiko/pepper-factory.svg?style=flat)](http://travis-ci.org/chiefbiiko/pepper-factory) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/pepper-factory?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/pepper-factory) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

***

**_Peppering_** describes a technique that allows to assemble a function call incrementally, supplying arguments in any arbitrary order, by name. A **_peppering function_** returns `undefined` if there are remaining undefined parameters to the **_peppered function_**. A **_peppering function_** returns the evaluated **_peppered function_** once arguments to all required parameters of the **_peppered function_** have been supplied. It is closely related to [auto currying](https://github.com/hemanth/functional-programming-jargon#auto-currying) but revolves around a **_peppering function_** that identifies parameter-argument bindings by name rather than by order. To that end, arguments to the **_peppering function_** are supplied in the form of an arguments object.

This approach allows to supply a function's arguments incrementally and in an arbitrary order, not necessarily the parameter order of the function's signature. Useful for dynamically building function calls, fx from incremental user input.

***

## Usage

**_Pepper_** a function by passing it to the `pepperFactory` alongside an array that lists its parameter names in the same order as they appear in the function's signature, and an optional `opts` object. The returned **_peppering function_** grabs arguments for its underlying function only from plain old js objects, any other input is just ignored.

```js
const pepperFactory = require('pepper-factory')
const stringify = (a, b, c) => `a:${a}, b:${b}, c:${c}`
const pepper = pepperFactory(stringify, [ 'a', 'b', 'c' ], {/*...*/})

pepper({ c: 77 }) // -> undefined
pepper(undefined) // -> undefined
pepper(false)     // -> undefined
pepper(0)         // -> undefined
pepper(null)      // -> undefined
pepper(() => {})  // -> undefined
pepper({ a: 36 }) // -> undefined
pepper({ b: 44 }) // -> 'a:36, b:44, c:77'
```

**_Peppering_** behavior can be tweaked by setting some options.

***

## API

### `const pepper = pepperFactory(func, paramNames[, opts])`

Make a **_peppering_** function.

+ `func` *Function* The function to be **_peppered_** **required**
+ `paramNames` *string[]* An array of the parameter names for `func` (in the same order as in its signature) **required**
+ `opts` *Object* Further options **optional**

`opts` defaults to:

```js
{
  // opts.aims: string[]
  // match props to args only within the indicated objects
  // []                      -> top-level object only
  // [ '*' ]                 -> objects at any branch and any level
  // [ 'a.b*', 'b.*c', 'd' ] -> objects at the leaves of these branches, with a * matching any number of chars
  aims: [],
  // opts.overwrite: boolean
  // overwrite previously stored argument matches?
  overwrite: false,
  // clearEvery: number
  // clear stored argument matches after every N calls, 0 indicates never
  clearEvery: 0,
  // that: any
  // this when evaluating func
  that: null
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

### `pepper.getStash()`

Get the internal arguments object.

**Return** Object

### `pepper.getConfig()`

Get an configurations object that includes all defined and defaulted arguments of `pepperFactory`.

**Return** Object

***

## License

[MIT](./license.md)
