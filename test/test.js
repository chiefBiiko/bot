'use strict'

const chai = require('chai')
const should = chai.should()

const andFmtArr = require('./../helpers/andFmtArr')
const toTitleCase = require('./../helpers/toTitleCase')
const checkForUserName = require('./../helpers/checkForUserName')
const replaceOrNull = require('./../helpers/replaceOrNull')
const matchExAx = require('./../helpers/matchExAx')
const makeActiveMap = require('./../helpers/makeActiveMap')

const tokenizeText = require('./../middlewares/tokenizeText')
const makeManageSessions = require('./../middlewares/makeManageSessions')
const makeMaybeRepeat = require('./../middlewares/makeMaybeRepeat')
const flag = require('./../middlewares/flag')
const patchProductInfo = require('./../middlewares/patchProductInfo')
const makeChooseResponse = require('./../middlewares/makeChooseResponse')

const makeStoreOutgoing = require('./../middlewares/makeStoreOutgoing')

describe('helpers', () => {
  describe('andFmtArr', () => {
    it('should return a string', () => {
      andFmtArr(['pizza', 'pasta', 'burgers']).should.be.a('string')
    })
    it('should format an array to a semantic sequence', () => {
      andFmtArr(['a', 'b', 'c']).should.equal('a, b, and c')
    })
    it('should handle empty and length-one arrays', () => {
      andFmtArr([]).should.equal('')
      andFmtArr([1]).should.equal('1')
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
      const SESSIONS = makeActiveMap(1)
      SESSIONS.set('testsession', {
        convo: { stop: () => {} }, // stop() must be implemented
        last_stamp: 1504786753609 // .last_stamp must be a timestamp
      })
      setTimeout(() => {
        SESSIONS.should.be.empty
        done()
      }, 1000 * 61)       // exec timeout
    }).timeout(1000 * 63) // test timeout
  })
})

describe('incoming middlewares', () => {
  describe('tokenizeText', () => {
    const e = tokenizeText({ text: 'Hi Ho' }, () => {})
    it('should return an object (e)', () => {
      e.should.be.an('object')
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
  describe('makeMaybeRepeat', () => {
    const SESSIONS = makeActiveMap(1) // dependency
    const maybeRepeat = makeMaybeRepeat(SESSIONS)
    it('should return a function', () => {
      maybeRepeat.should.be.a('function')
    })
    it('should have more tests...', () => {
      null.should.have.more.tests
    })
  })
  describe('makeCheckAgainstDB', () => {
    it('should be tested...', () => {
      null.should.be.tested
    })
  })
  describe('flag', () => {
    const e = flag({
      text: 'tell me the price of the iphone 7',
      stash: {
        exactProducts: [ 'iphone 7' ],
        hitProducts: {
          'iphone 7' : {
            category: 'smartphones',
            features: [ 'hd-camera', 'siri' ],
            pictures: [ 'iphront.png', 'iphback.png' ],
            price: 900,
            ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ],
          }
        }
      }
    },
    () => {})
    it('should set boolean flags as e.stash.hitProducts.*.flags.wants*', () => {
      e.stash.hitProducts['iphone 7'].flags.should.be.an('object')
      Object.keys(e.stash.hitProducts['iphone 7'].flags).forEach(flag => {
        e.stash.hitProducts['iphone 7'].flags[flag].should.be.a('boolean')
      })
    })
  })
  describe('patchProductInfo', () => {
    const e = patchProductInfo({
      text: 'tell me the price of the iphone 7',
      stash: {
        exactProducts: [ 'iphone 7' ],
        hitProducts: {
          'iphone 7' : {
            category: 'smartphones',
            features: [ 'hd-camera', 'siri' ],
            pictures: [ 'iphront.png', 'iphback.png' ],
            price: 900,
            ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ],
            flags: {
               features: false,
               pictures: false,
               price: true,
               ratings: false,
               wantsMinRating: false,
               wantsMaxRating: false,
               wantsAvgRating: false
            }
          }
        }
      }
    },
    () => {})
    it('should add a string under e.stash.hitProducts.*.patch', () => {
      e.stash.hitProducts['iphone 7'].patch.should.be.a('string')
    })
  })
  describe('makeChooseResponse', () => {
    const SESSIONS = makeActiveMap(1) // dependency
    it('should return a function', () => {
      makeChooseResponse(SESSIONS).should.be.a('function')
    })
    it('should have more tests...', () => {
      null.should.have.more.tests
    })
  })
})

describe('outgoing middlewares', () => {
  describe('makeStoreOutgoing', () => {
    const SESSIONS = makeActiveMap(1) // dependency
    const storeOutgoing = makeStoreOutgoing(SESSIONS) // closure
    it('should return a function', () => {
      storeOutgoing.should.be.a('function')
    })
    it('should factor a function that sets a string property ' +
       'session.convo.last_outgoing on each member of SESSIONS', () => {
         SESSIONS.set('xyz', {
           convo: { stop: () => {} }, // stop() must be implemented
           last_stamp: 1504786753609 // .last_stamp must be a timestamp
         })
         storeOutgoing({ text: 'last-sent msg', user: { id: 'xyz' } }, () => {})
         SESSIONS.get('xyz').last_outgoing.should.be.a('string')
       })
  })
})
