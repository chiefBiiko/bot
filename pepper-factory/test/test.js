const should = require('chai').should()

const pepperFactory = require('./../pepper2')

describe('pepperFactory', () => {
  const noop = () => {}
  it('should return a function', () => {
    pepperFactory(noop, []).should.be.a('function')
  })  
})

describe('pepper', () => {
  const stringify = (a, b) => `a:${a}, b:${b}`
  const pepper = pepperFactory(stringify, [ 'a', 'b' ], [ 0 ], false, null)
  it('should autocurry', () => {
    should.equal(pepper({ a: 1 }), undefined)
    pepper({ b: 2 }).should.equal('a:1, b:2')
    // eval and clear!!!
    pepper({ a: 11, b: 22 }).should.equal('a:11, b:22')
  })
  it('should numb on "wrong" input', () => {
    should.equal(pepper([]), undefined)
    should.equal(pepper({}), undefined)
    should.equal(pepper(36), undefined)
    should.equal(pepper(null), undefined)
    should.equal(pepper({ b: 0 }), undefined)
    pepper({ a: 1 }).should.equal('a:1, b:0')
  })
})

describe('pepper (clear)', () => {
  const stringify = (a, b) => `a:${a}, b:${b}`
  const pepper = pepperFactory(stringify, [ 'a', 'b' ], [ 0 ], false, null)
  it('should clear its arguments after every evaluation', () => {
    should.equal(pepper({ a: 1 }), undefined)
    pepper({ b: 2 }).should.equal('a:1, b:2')
    should.equal(pepper({ b: 3 }), undefined)
    pepper({ a: 4 }).should.equal('a:4, b:3')
  })
  it('should have a clear method, to be invoked manually', () => {
    pepper.clear.should.be.a('function')
  })
  it('should have an overloaded .clear method', () => {
    should.equal(pepper({ a: 33 }), undefined)
    pepper.clear()
    should.equal(pepper({ b: 44 }), undefined)
    pepper.clear([ 'b' ])
    should.equal(pepper({ a: 33 }), undefined)
    pepper({ b: 44 }).should.equal('a:33, b:44')
   })
})

describe('fuzzy pepper', () => {
  const stringify = (a, b) => `a:${a}, b:${b}`
  const fuzzyPepper = pepperFactory(stringify, [ 'a', 'b' ], [ -1 ], false, null)
  it('should take values as indicated in searchDepth, fx anywhere', () => {
    should.equal(fuzzyPepper({ z: { y: { b: 5 } } }), undefined)
    fuzzyPepper({ z: { a: 6 } }).should.equal('a:6, b:5')
  })
})

describe('sharp pepper', () => {
  const stringify = (a, b) => `a:${a}, b:${b}`
  const sharpPepper = pepperFactory(stringify, [ 'a', 'b' ], [ 1, 2 ], false, null)  
  it('should only search at depths that are indicated', () => {
    should.equal(sharpPepper({ a: { y: { z: 7 } } }), undefined)
    should.equal(sharpPepper({ b: { x: 8 }, c: [] }), undefined)
    should.equal(sharpPepper({ a: 9 }), undefined)
    should.equal(sharpPepper({ b: 10, c: false }), undefined)
    should.equal(sharpPepper({ x: { y: { b: 11 } } }), undefined)
    sharpPepper({ y: { a: 12 } }).should.equal('a:12, b:11')
  })
})