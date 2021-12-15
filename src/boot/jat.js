import { boot } from 'quasar/wrappers'
import NTMath from 'src/ntoolkit/math'

class Randomizer {
  constructor (array) {
    this.array = array
    this.history = []
    this.id = array.join('')
  }

  next () {
    let value = ''
    const n = this.array.length
    if (n === 0) return ''
    if (n === 1) return this.array[0]
    let maxN = Math.min(n - 1, 5)
    while (this.history.length > maxN) {
      this.history.splice(0, 1)
    }
    let lastIndex = -1
    if (this.history.length > 0) {
      const lastHistory = this.history[this.history.length - 1]
      lastIndex = this.array.indexOf(lastHistory)
    }
    do {
      let index = 0
      do {
        index = NTMath.randomInt(0, n - 1)
      }
      while (index === lastIndex)
      value = this.array[index]
      maxN--
    } while (maxN > 0 && this.history.indexOf(value) >= 0)

    this.history.push(value)
    return value
  }
}

export const Jat = {
  randomizers: [],

  getRandom: function (data) {
    let existing = this.randomizers.filter(x => x.id === data.join(''))
    if (existing.length > 0) {
      existing = existing[0]
    } else {
      existing = new Randomizer(data)
      this.randomizers.push(existing)
    }
    if (existing) return existing.next()
  },

  getRandomFromLines: function (multiline) {
    return this.getRandom(this.splitNotEmpty(multiline))
  },

  splitNotEmpty: function (multiline) {
    const list = []
    const splits = multiline.split('\n')
    splits.forEach(x => {
      x = x.trim()
      if (x !== '') {
        list.push(x)
      }
    })
    return list
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$jat = Jat
})
