const should = require('chai').should()

const pepperFactory = require('./../index')

describe('pepperFactory', () => {
  const noop = () => {}
  const binary = (a, b) => a + b
  it('should return a function', () => {
    pepperFactory(noop, []).should.be.a('function')
  })
  it('should return a function that is evaluated once all parameters ' +
     'have been supplied', () => {
    const pepper = pepperFactory(binary, [ 'a', 'b' ])
    pepper({ a: 1 }).should.be.a('function')
    pepper({ b: 2 }).should.be.a('number')
  })
})