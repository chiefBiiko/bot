const chai = require('chai')
const should = chai.should()

const andFmtArr = require('./../helpers/andFmtArr')
const toTitleCase = require('./../helpers/toTitleCase')
const checkForUserName = require('./../helpers/checkForUserName')
const replaceOrNull = require('./../helpers/replaceOrNull')
const matchExactAndApprox = require('./../helpers/matchExactAndApprox')
const makeSessionMap = require('./../helpers/makeSessionMap')

const lowerCaseAndTokenize = require('./../middlewares/lowerCaseAndTokenize')

describe('helpers', () => {
  describe('andFmtArr', () => {
    it('should return a string', () => {
      andFmtArr(['pizza', 'pasta', 'burgers']).should.be.a('string')
    })
    it('should format an array to a semantic sequence', () => {
      andFmtArr(['a', 'b', 'c']).should.equal('a, b, and c')
    })
  })
  describe('toTitleCase', () => {
    it('should uppercase the first letter of a string', () => {
      toTitleCase('chief').should.equal('Chief')
    })
    it('should handle the jim-bob -> Jim-Bob problem', () => {
      toTitleCase('jim-bob').should.equal('Jim-Bob')
    })
  })
  describe('checkForUserName', () => {
    it('should extract a name from a "i am..." statement', () => {
      checkForUserName('hi, i am ananse').should.equal('Ananse')
    })
    it('should extract a name from a "my name is..." statement', () => {
      checkForUserName('wahala my name is kweku mensa').should.equal('Kweku')
    })
    it('should return an empty string if no name detected', () => {
      checkForUserName('my number one food is pizza').should.equal('')
    })
  })
  describe('replaceOrNull', () => {
    it('should return a string in case of a replacement', () => {
      replaceOrNull('abc', /[ci]/, 'z').should.equal('abz')
    })
    it('should return null in case of no replacement', () => {
      should.equal(replaceOrNull('abc', 'y', 'z'), null)
    })
  })
  describe('matchExactAndApprox', () => {
    it('should return a 2D array', () => {
      const x = matchExactAndApprox('buy me an ipad pro',
                                    ['buy', 'me', 'an', 'ipad', 'pro'],
                                    ['iphone 7', 'ipad pro'])
      x.should.be.an('array')
      x.forEach(y => y.should.be.an('array'))
    })
    it('should return an array of length 2', () => {
      const x = matchExactAndApprox('buy me an ipad pro',
                                    ['buy', 'me', 'an', 'ipad', 'pro'],
                                    ['iphone 7', 'ipad pro'])
      x.should.have.lengthOf(2)
    })
    it('should return an array that has at least one empty array', () => {
      const x = matchExactAndApprox('buy me an ipad pro',
                                    ['buy', 'me', 'an', 'ipad', 'pro'],
                                    ['iphone 7', 'ipad pro'])
      x.some(y => y.length === 0).should.be.true
    })
  })
  describe('makeSessionMap', () => {
    it('should return an ~auto-flush map', done => {
      const afmap = makeSessionMap(1)
      afmap.set('testsession', {
        convo: { stop: () => {} }, // stop() must be implemented
        last_stamp: 1504786753609 // .last_stamp must be a timestamp
      })
      setTimeout(() => {
        afmap.should.be.empty
        done()
      }, 1000 * 61)       // exec timeout
    }).timeout(1000 * 62) // test timeout
  })
})
