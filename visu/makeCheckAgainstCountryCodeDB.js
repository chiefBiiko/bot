'use strict'

const matchExactAndApprox = require('./matchExactAndApprox')

module.exports = CountryCodeDB => {
  // assemble factory return
  const checkAgainstCountryCodeDB = (e, next) => { // closes over CountryCodeDB
    if (Object.keys(e.response).length) next(null, e)
    // CountryCodeDB subsets
    const countrynames = Object.keys(CountryCodeDB.nameToCode)
    const countrycodes = Object.keys(CountryCodeDB.codeToName)
    // code/name hit arrays
    const namematches = matchExactAndApprox(e.text, e.tokens, countrynames, 1)
    const codematches = countrycodes.filter(cc => e.tokens.some(tok => tok === cc))
    //.filter(cc => RegExp(`^(.*\s)?${cc}(\s.*)?$`).test(e.text))
    // store country code mappings on e.stash
    e.stash = {
      nameToCode: namematches.reduce((acc, cur) => {
        acc[cur] = CountryCodeDB.nameToCode[cur]
        return acc
      }, {}),
      codeToName: codematches.reduce((acc, cur) => {
        acc[cur] = CountryCodeDB.codeToName[cur]
        return acc
      }, {}),
      allCodes: [ ...new Set(codematches.concat(namematches.map(countryname => {
        return CountryCodeDB.nameToCode[countryname]
      }))) ]
    }
    next(null, e)
    return e // 4 dev tests only
  }
  // returning a closure
  return checkAgainstCountryCodeDB
}