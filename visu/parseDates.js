'use strict'

const chrono = require('chrono-node')

const zeroPadToTwoDigitString = d => d < 10 && d >= 0 ? `0${d}` : `${d}`

const nextDate = date => {
  var dat = new Date(date.valueOf())
  dat.setDate(dat.getDate() + 1)
  return dat
}

const fmtDate = date => {
  return `${date.getFullYear()}-${
            zeroPadToTwoDigitString(date.getMonth() + 1)}-${
            zeroPadToTwoDigitString(date.getDate())}`
}

const parseEmAll = text => {
  const days = []
  const re = chrono.parse(text)
  var start
  if (re[0] instanceof Object && re[0].hasOwnProperty('start')) {
    start = new Date(re[0].start.date().getTime())
    days.push(fmtDate(start))
    if (re[0].hasOwnProperty('end')) {
      const end_ts = re[0].end.date().getTime()
      let stepDay = nextDate(start)
      while (end_ts >= stepDay.getTime()) {
        days.push(fmtDate(stepDay))
        stepDay = nextDate(stepDay)
      }
    }
  }
  return days
}

module.exports = parseEmAll

if (process.argv[2]) console.log(parseEmAll(process.argv[2]))