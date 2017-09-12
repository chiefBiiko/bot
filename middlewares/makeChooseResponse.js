'use strict'

const replaceOrFalsy = require('./../helpers/replaceOrFalsy')

module.exports = (SESSIONS) => {
   const chooseResponse = (e, next) => {
     const session = SESSIONS.get(e.user.id)
     if (Object.keys(e.stash.hitProducts).length !== 0) {
       Object.keys(e.stash.hitProducts).forEach(pname => {
         session.convo.say('#hit-product', {
           patch: e.stash.hitProducts[pname].patch
         })
       })
     } else if (Object.keys(e.stash.approxProducts).length !== 0) {
       const assertProductKey = Object.keys(e.stash.approxProducts)[0]
       const assertProductVal = e.stash.approxProducts[assertProductKey]
       session.convo.say('#assert-product', { product: assertProductVal })
       session.onyes = e.text.replace(RegExp(assertProductKey, 'g'),
                                      assertProductVal) // NEW
     } else if (e.stash.exactCategories.length !== 0) {
       session.convo.say('#hit-category', {
         category: e.stash.exactCategories[0]
       })
     } else if (Object.keys(e.stash.approxCategories).length !== 0) {
       const assertCategoryKey = Object.keys(e.stash.approxCategories)[0]
       const assertCategoryVal = e.stash.approxCategories[assertCategoryKey]
       session.convo.say('#assert-category', { category: assertCategoryVal })
       session.onyes = e.text.replace(RegExp(assertCategoryKey, 'g'),
                                      assertCategoryVal) // NEW
     } else {
       session.convo.say('#fallback')
     }
     next()
     return e // 4 dev tests only, ignored by botpress
   }
   // returning a closure
   return chooseResponse
}
