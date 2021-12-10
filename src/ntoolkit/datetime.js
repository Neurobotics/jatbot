// (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru

export const NTDateTime = {
  msToHours: (1000 * 60 * 60),
  msToMinutes: (1000 * 60),

  printTime: function (timeSeconds, showMs = true) {
    let result = ''
    if (isNaN(timeSeconds)) timeSeconds = 0
    if (timeSeconds < 0) {
      result = '-'
      timeSeconds = -timeSeconds
    }
    timeSeconds = parseFloat(timeSeconds)
    let minutes = Math.floor(timeSeconds / 60)
    let hours = 0
    while (minutes > 60) {
      hours++
      minutes -= 60
    }
    const secondsFloor = Math.floor(timeSeconds)
    const seconds = secondsFloor - hours * 60 * 60 - minutes * 60
    const ms = Math.floor((timeSeconds - secondsFloor) * 1000)

    if (hours > 0) {
      result += this.zeroPad(hours) + ':'
    }
    result += this.zeroPad(minutes) + ':'
    result += this.zeroPad(seconds)
    if (showMs === true) {
      result += '.' + (ms < 100 ? '0' : '') + this.zeroPad(ms)
    }
    return result
  },

  dateFromStr: function (dateStr, splitter = '-') {
    const splits = dateStr.split(splitter)
    if (splits.length < 3) return new Date(0, 0, 0)
    const yearComesFirst = splits[0].length === 4
    const year = parseInt(splits[yearComesFirst ? 0 : 2])
    const month = parseInt(splits[1]) - 1
    const day = parseInt(splits[yearComesFirst ? 2 : 0])
    return new Date(year, month, day)
  },

  dayIndex: function (date) {
    if (typeof date === 'undefined') {
      date = new Date()
    }
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = date - start
    const oneDay = 1000 * 60 * 60 * 24
    const day = Math.floor(diff / oneDay)
    return day
  },

  isDate: function (value) {
    return typeof value === 'object' && typeof value.getMonth === 'function'
  },

  zeroPad: function (value) {
    value = parseInt(value)
    return (value < 10 ? '0' : '') + value
  },

  formatYmd: function (date, separator = '-') {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    let datestring = y + separator
    if (m < 10) datestring += '0'
    datestring += m + '-'

    if (d < 10) datestring += '0'
    datestring += d

    return datestring
  },

  formatHis: function (dateOrTime, splitter = ':') {
    let h = 0
    let m = 0
    let s = 0
    if (this.isDate(dateOrTime)) {
      h = dateOrTime.getHours()
      m = dateOrTime.getMinutes()
      s = dateOrTime.getSeconds()
    } else {
      // Assuming the time is in ms
      h = Math.floor(dateOrTime / this.msToHours)
      dateOrTime -= h * this.msToHours
      m = Math.floor(dateOrTime / this.msToMinutes)
      dateOrTime -= h * this.msToMinutes
      s = Math.floor(dateOrTime / 1000)
    }
    return this.zeroPad(h) + splitter + this.zeroPad(m) + splitter + this.zeroPad(s)
  },

  formatYmdHis: function (date, splitterDate = '-', splitterTime = ':', splitterDateTime = ' ') {
    return this.formatYmd(date, splitterDate) + splitterDateTime + this.formatHis(date, splitterTime)
  }
}

export default NTDateTime
