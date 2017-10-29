const should = require('chai').should()

const pepperFactory = require('./../index')

describe('pepperFactory', () => {
  const noop = () => {}
  const binaryAdd = (a, b) => a + b
  it('should return a function', () => {
    pepperFactory(noop, []).should.be.a('function')
  })
  it('should return a function that is evaluated once all parameters ' +
     'have been supplied', () => {
    const pepper = pepperFactory(binaryAdd, [ 'a', 'b' ])
    should.equal(pepper({ a: 1 }), undefined)
    pepper({ b: 2 }).should.equal(3)
  })
})