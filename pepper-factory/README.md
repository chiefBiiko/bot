# pepper

***

`Peppering` describes a technique that allows to assemble a function call incrementally, supplying arguments in any arbitrary order, by name. A `peppering function` returns undefined if there are remaining undefined parameters to the `peppered function`. A `peppering function` returns the evaluated `peppered function` once arguments to all required parameters of the `peppered function` have been supplied. It is closely related to `autocurrying` but revolves around a `peppering function` that identifies parameter-argument bindings by name rather than by order. To that end, arguments to the `peppering function` are supplied in the form of an arguments object.

This approach allows to supply a function's arguments incrementally and in an arbitrary order, not necessarily the parameter order of the function's signature. Useful for dynamically building function calls, fx from incremental user input.

***

### Usage

...

```js
const pepperFactory = require('pepper-factory')
const stringify = (a, b, c) => `a:${a}, b:${b}, c:${c}`

// 2nd argument to pepperFactory must be a string[] listing the parameter
// names of the function getting peppered in the same order as they appear
// in its signature
const pepper = pepperFactory(stringify, [ 'a', 'b', 'c' ])

// peppering stringify
pepper({ c: 77 }) // -> undefined
pepper({ a: 36 }) // -> undefined
pepper({ b: 44 }) // -> 'a:36, b:44, c:77'
```

***

### License

MIT