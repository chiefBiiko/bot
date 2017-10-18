'use strict'

const chrono = require('chrono-node')

const zeroPadToTwoDigitString = d => d < 10 && d >= 0 ? `0${d}` : `${d}`

const nextDate = timestamp => {
  var dat = new Date(timestamp.valueOf())
  dat.setDate(dat.getDate() + 1)
  return dat
}

const parseEmAll = text => {
  const days = []
  const re = chrono.parse(text)
  var start_ts
  if (re[0] instanceof Object && re[0].hasOwnProperty('start')) {
    start_ts = new Date(re[0].start.date().getTime())
    days.push(
      `${start_ts.getFullYear()}-${
         zeroPadToTwoDigitString(start_ts.getMonth() + 1)}-${
         zeroPadToTwoDigitString(start_ts.getDate())}`
    )
    if (re[0].hasOwnProperty('end')) {
      const end_ts = re[0].end.date().getTime()
      let nextDay = nextDate(start_ts)
      while (end_ts >= nextDay.getTime()) {
        days.push(
          `${nextDay.getFullYear()}-${
             zeroPadToTwoDigitString(nextDay.getMonth() + 1)}-${
             zeroPadToTwoDigitString(nextDay.getDate())}`
        )
        nextDay = nextDate(nextDay.getTime())
      }
    }
  }
  return days
}

module.exports = parseEmAll

if (process.argv[2]) console.log(parseEmAll(process.argv[2]))