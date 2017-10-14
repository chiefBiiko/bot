const mocha = require('mocha')
const should = require('chai').should()

const fs = require('fs')
const path = require('path')

const sqlSelectOnJSON = require('../index')

describe('sqlSelectOnJSON', () => {

  it('should be a function', () => {
    sqlSelectOnJSON.should.be.a('function')
  })
  it('should allow in-memory JSON as DB references', () => {
    const inMemory = '{"noop":[{"id":1,"a":0},{"id":2,"a":1}]}'
    sqlSelectOnJSON.bind(null, inMemory, 'SELECT * FROM noop')
      .should.not.throw(Error)
  })
  it('should allow filepaths as DB references', () => {
    const con = path.join(__dirname, '..', 'data', 'db.json')
    sqlSelectOnJSON.bind(null, con, 'SELECT * FROM inventory')
      .should.not.throw(Error)
  })
  it('should return an array of objects aka the result-set', () => {
    const con = path.join(__dirname, '..', 'data', 'db.json')
    const result = sqlSelectOnJSON(con, 'SELECT * FROM inventory')
    result.should.be.an('array')
    result.forEach(dataset => dataset.should.be.an('object'))
  })

})
