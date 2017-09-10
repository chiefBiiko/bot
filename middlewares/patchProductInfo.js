'use strict'

const andFmtArr = require('./../helpers/andFmtArr')

module.exports = (e, next) => {
  Object.keys(e.stash.hitProducts).forEach(pname => {
    const patches = // assemble an array of statements for each product
      Object.keys(e.stash.hitProducts[pname].flags)
        .filter(flag => e.stash.hitProducts[pname].flags[flag]) // flag: bool
        .map(flag => {
          switch(flag) {
            case 'features':
              return `has ${['these', 'cool'][Math.round(Math.random())]} ` +
                `features - ${andFmtArr(e.stash.hitProducts[pname].features)}`
            case 'pictures':
              return `here are some pics - ` +
                `${andFmtArr(e.stash.hitProducts[pname].pictures)}`
            case 'price':
              return `costs ${e.stash.hitProducts[pname].price}€`
            case 'ratings':
              return `got ${e.stash.hitProducts[pname].ratings.length} ratings`
            case 'wantsMinRating':
              return `has a minimum rating of ` +
                `${Math.min(...e.stash.hitProducts[pname].ratings)}`
            case 'wantsMaxRating':
              return `has a maximum rating of ` +
                `${Math.max(...e.stash.hitProducts[pname].ratings)}`
            case 'wantsAvgRating':
              return `has an average rating of ` +
                `${e.stash.hitProducts[pname].ratings.reduce((a, c) => a + c) /
                  e.stash.hitProducts[pname].ratings.length}`
            default:
              throw new Error('switch fallthrough!')
          }
        })
    // patch for product
    e.stash.hitProducts[pname].patch =
      `The ${pname} ` + (andFmtArr(patches) || 'is awesome ;) [product card]')
  })
  next()
  return e // 4 dev tests only, ignored by botpress
}
