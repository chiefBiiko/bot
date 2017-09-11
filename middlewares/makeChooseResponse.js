'use strict'

module.exports = (SESSIONS) => {
   const chooseResponse = (e, next) => {
     const session = SESSIONS.get(e.user.id)
     if (Object.keys(e.stash.hitProducts).length !== 0) {
       Object.keys(e.stash.hitProducts).forEach(pname => {
         session.convo.say('#hit-product', {
           patch: e.stash.hitProducts[pname].patch
         })
       })
     } else if (e.stash.approxProducts.length !== 0) {
       session.convo.say('#assert-product', {
         product: e.stash.approxProducts[0]
       })
     } else if (e.stash.exactCategories.length !== 0) {
       session.convo.say('#hit-category', {
         category: e.stash.exactCategories[0]
       })
     } else if (e.stash.approxCategories.length !== 0) {
       session.convo.say('#assert-category', {
         category: e.stash.approxCategories[0]
       })
     } else {
       session.convo.say('#fallback')
     }
     next()
     return e // 4 dev tests only, ignored by botpress
   }
   // returning a closure
   return chooseResponse
}
