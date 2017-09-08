'use strict'

const chai = require('chai')
const should = chai.should()

const andFmtArr = require('./../helpers/andFmtArr')
const toTitleCase = require('./../helpers/toTitleCase')
const checkForUserName = require('./../helpers/checkForUserName')
const replaceOrNull = require('./../helpers/replaceOrNull')
const matchExAx = require('./../helpers/matchExAx')
const makeActiveMap = require('./../helpers/makeActiveMap')

const lowerCaseAndTokenize = require('./../middlewares/lowerCaseAndTokenize')
const makeManageSessions = require('./../middlewares/makeManageSessions')
const flag = require('./../middlewares/flag')
const assemble = require('./../middlewares/assemble')

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
  describe('matchExAx', () => {
    const x = matchExAx('buy me an ipad pro',
                        ['buy', 'me', 'an', 'ipad', 'pro'],
                        ['iphone 7', 'ipad pro'])
    it('should return an object with .exact and .approx', () => {
      x.should.be.an('object')
      x.should.have.all.keys('exact', 'approx')
    })
    it('should return an object that has arrays as values', () => {
      x.exact.should.be.an('array')
      x.approx.should.be.an('array')
    })
  })
  describe('makeActiveMap', () => {
    it('should return an ~auto-flush map', done => {
      const afmap = makeActiveMap(1)
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

describe('incoming middlewares', () => {
  describe('lowerCaseAndTokenize', () => {
    const e = lowerCaseAndTokenize({ text: 'Hi Ho' }, () => {})
    it('should return an object (e)', () => {
      e.should.be.an('object')
    })
    it('should return e with a lowercased text property value', () => {
      RegExp('[A-Z]').test(e.text).should.be.false
    })
    it('should return e with an array for .tokens', () => {
      e.tokens.should.be.an('array')
    })
  })
  describe('makeManageSessions', () => {
    const bp = { // dependency
      convo: {
        start: (a, b) => {
          return { say: () => {}, repeat: () => {} }
        }
      }
    }
    const activeMap = makeActiveMap(1) // dependency
    const manageSessions = makeManageSessions(bp, activeMap)
    it('should return a function', () => {
      manageSessions.should.be.a('function')
    })
    it('should return a function that manages activeMap\'s members', () => {
      manageSessions({ text: 'Hi Ho', user: { id: 'xyz' } }, () => {})
      const session = activeMap.get('xyz')
      session.should.be.an('object')
      session.should.have.all.keys('convo', 'first_name', 'last_query',
                                   'last_stamp')
    })
  })
  describe('makeCheckAgainstDB', () => {
    //...
  })
  describe('flag', () => {
    const e = flag({ text: 'give me the average rating for the ipad pro' },
                   () => {})
    it('should set a bunch of boolean flags as e.flags.wants*', () => {
      e.flags.should.have.all.keys('wantsFeatures', 'wantsPictures',
                                   'wantsPrice', 'wantsRating',
                                   'wantsMin', 'wantsMax', 'wantsAvg')
      Object.keys(e.flags).filter(flag => flag.startsWith('wants'))
        .forEach(wantsFlag => e.flags[wantsFlag].should.be.a('boolean'))
    })
  })
  describe('assemble', () => {
    const e = assemble({ stash: { exactProduct: ['iphone 7', 'ipad pro'] },
                         flags: {
                            wantsFeatures: true,
                            wantsPictures: false,
                            wantsPrice: true,
                            wantsRating: false,
                            wantsMin: false,
                            wantsMax: false,
                            wantsAvg: false
                         }
                       },
                       () => {})
    it('should add a new object under .patch on e', () => {
      e.should.have.keys('patch')
    })
    it('should add an array of text chunks for each exact product hit', () => {
      e.patch['iphone 7'].should.be.an('array')
      e.patch['ipad pro'].should.be.an('array')
    })
  })
})
