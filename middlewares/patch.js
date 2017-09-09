'use strict'

const andFmtArr = require('./../helpers/andFmtArr')

module.exports = (e, next) => {
  Object.keys(e.stash.hitProducts).forEach(pname => {
    e.stash.hitProducts[pname].patch = `The ${pname} ` +
      andFmtArr(Object.keys(e.stash.hitProducts[pname].flags)
        .filter(flag => e.stash.hitProducts[pname].flags[flag]) // get all truthy
        .map(flag => {
          switch(flag) {
            case 'features':
              return `has ${['these', 'cool'][Math.round(Math.random())]} ` +
                `features: ${andFmtArr(e.stash.hitProducts[pname].features)}`
            case 'pictures':
              return 'looks better in your hands, but here are some pics: ' +
                andFmtArr(e.stash.hitProducts[pname].pictures)
            case 'price':
              return `costs ${e.stash.hitProducts[pname].price}€`
            case 'ratings':
              return 'has an average rating of ' +
                (e.stash.hitProducts[pname].ratings.reduce((a, c) => a + c) /
                  e.stash.hitProducts[pname].ratings.length).toString() +
                  'out of ' +
                  e.stash.hitProducts[pname].ratings.length.toString() +
                  'ratings'
            case 'wantsMinRating':
              return 'has a minimum rating of ' +
                Math.min(...e.stash.hitProducts[pname].ratings).toString()
            case 'wantsMaxRating':
              return 'has a maximum rating of ' +
                Math.max(...e.stash.hitProducts[pname].ratings).toString()
            case 'wantsAvgRating':
              return 'has an average rating of ' +
                (e.stash.hitProducts[pname].ratings.reduce((a, c) => a + c) /
                  e.stash.hitProducts[pname].ratings.length).toString()
            default:
              return `is awesome ;)`
          }
        })
      )
  })
  next()
  return e // 4 dev tests only, ignored by botpress
}
