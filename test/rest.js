// const should = require('chai').should()
//
// const pepperFactory = require('./../dev/pepper5')
//
// describe('pepperFactory', () => {
//   const noop = () => {}
//   it('should return a function', () => {
//     pepperFactory(noop, []).should.be.a('function')
//   })
// })
//
// describe('pepper', () => {
//   const stringify = (a, b) => `a:${a}, b:${b}`
//   const pepper = pepperFactory(stringify, [ 'a', 'b' ])
//   it('should autocurry', () => {
//     should.equal(pepper({ a: 1 }), undefined)
//     pepper({ b: 2 }).should.equal('a:1, b:2')
//     // eval and clear!!!
//     pepper({ a: 11, b: 22 }).should.equal('a:11, b:22')
//   })
//   it('should numb on "wrong" input', () => {
//     should.equal(pepper([]), undefined)
//     should.equal(pepper({}), undefined)
//     should.equal(pepper(36), undefined)
//     should.equal(pepper(null), undefined)
//     should.equal(pepper({ b: 0 }), undefined)
//     pepper({ a: 1 }).should.equal('a:1, b:0')
//   })
// })
//
// describe('pepper (clear)', () => {
//   const stringify = (a, b) => `a:${a}, b:${b}`
//   const pepper = pepperFactory(stringify, [ 'a', 'b' ])
//   it('should clear its arguments after every evaluation', () => {
//     should.equal(pepper({ a: 1 }), undefined)
//     pepper({ b: 2 }).should.equal('a:1, b:2')
//     should.equal(pepper({ b: 3 }), undefined)
//     pepper({ a: 4 }).should.equal('a:4, b:3')
//   })
//   it('should have a clear method, to be invoked manually', () => {
//     pepper.clear.should.be.a('function')
//   })
//   it('should have an overloaded clear method', () => {
//     should.equal(pepper({ a: 33 }), undefined)
//     pepper.clear()
//     should.equal(pepper({ b: 44 }), undefined)
//     pepper.clear([ 'b' ])
//     should.equal(pepper({ a: 55 }), undefined)
//     pepper({ b: 66 }).should.equal('a:55, b:66')
//    })
// })
//
// describe('pepper (overwrite)', () => {
//   const stringify = (a, b) => `a:${a}, b:${b}`
//   const lockPepper =
//     pepperFactory(stringify, [ 'a', 'b' ], { overwrite: false })
//   const freePepper =
//     pepperFactory(stringify, [ 'a', 'b' ], { overwrite: true })
//   it('should not allow overwriting if opts.overwrite !== true', () => {
//     should.equal(lockPepper({ a: 77 }), undefined)
//     should.equal(lockPepper({ a: 88 }), undefined)
//     lockPepper({ b: 99 }).should.equal('a:77, b:99')
//   })
//   it('should allow overwriting if opts.overwrite === true', () => {
//     should.equal(freePepper({ a: 77 }), undefined)
//     should.equal(freePepper({ a: 88 }), undefined)
//     freePepper({ b: 99 }).should.equal('a:88, b:99')
//   })
// })
//
// describe('pepper (getters)', () => {
//   const stringify = (a, b) => `a:${a}, b:${b}`
//   const pepper = pepperFactory(stringify, [ 'a', 'b' ])
//   it('should have getters getArgMap and getConfig', () => {
//     pepper.getArgMap.should.be.a('function')
//     pepper.getConfig.should.be.a('function')
//   })
//   it('should have getArgMap that returns an object', () => {
//     pepper.getArgMap().should.be.an('object')
//   })
//   it('should have getConfig that returns an object with keys...', () => {
//     const config = pepper.getConfig()
//     config.should.be.an('object')
//     config.should.have.all.keys('func', 'paramNames', 'opts')
//     config.opts
//       .should.have.all.keys('levels', 'overwrite', 'clearEvery', 'thisArg')
//   })
// })
//
// describe('fuzzy pepper', () => {
//   const stringify = (a, b) => `a:${a}, b:${b}`
//   const fuzzyPepper =
//     pepperFactory(stringify, [ 'a', 'b' ], { levels: [ -1 ] })
//   it('should take values as indicated in levels, fx anywhere', () => {
//     should.equal(fuzzyPepper({ z: { y: { b: 5 } } }), undefined)
//     fuzzyPepper({ z: { a: 6 } }).should.equal('a:6, b:5')
//   })
// })
//
// describe('sharp pepper', () => {
//   const stringify = (a, b) => `a:${a}, b:${b}`
//   const sharpPepper =
//     pepperFactory(stringify, [ 'a', 'b' ], { levels: [ 1, 2 ] })
//   it('should only search at levels that are indicated', () => {
//     should.equal(sharpPepper({ a: { y: { z: 7 } } }), undefined)
//     should.equal(sharpPepper({ b: { x: 8 }, c: [] }), undefined)
//     should.equal(sharpPepper({ a: 9 }), undefined)
//     should.equal(sharpPepper({ b: 10, c: false }), undefined)
//     should.equal(sharpPepper({ x: { y: { b: 11 } } }), undefined)
//     sharpPepper({ y: { a: 12 } }).should.equal('a:12, b:11')
//   })
// })
