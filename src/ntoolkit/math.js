// (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru

export const NTMath = {
  averageValue: function (array) {
    if (!Array.isArray(array)) return 0
    let avg = 0
    const n = array.length
    if (n === 0) return 0
    for (let i = 0; i < n; i++) {
      avg += array[i]
    }
    return avg / n
  },

  averageValues: function (array1, array2) {
    const d = []
    const n = Math.min(array1.length, array2.length)
    for (let i = 0; i < n; i++) {
      d.push((array1[i] + array2[i]) / 2)
    }
    return d
  },

  minMax: function (array) {
    let min = 0
    let max = 0
    const n = array.length
    if (n > 0) {
      min = array[0]
      max = array[0]
      for (let i = 1; i < n; i++) {
        const v = array[i]
        if (v > max) max = v
        else if (v < min) min = v
      }
    }
    return { min: min, max: max }
  },

  norm: function (value, min, max, coef = 100) {
    if (value < min) value = min
    else if (value > max) value = max
    return coef * (value - min) / (max - min)
  },

  random: function (min, max) {
    return Math.random() * (max - min) + min
  },

  randomInt: function (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  randomArrayItem: function (array) {
    if (!Array.isArray(array)) return null
    if (array.length === 0) return null
    return array[this.randomInt(0, array.length - 1)]
  },

  round2: function (number, precision = 2) {
    let del = 10
    while (precision > 1) {
      del *= 10
      precision--
    }
    return parseInt(number * del) / del
  },

  round2factor: function (number, factor) {
    return parseInt(number / factor) * factor
  },

  smooth: function (values, factor) {
    if (values.length < factor || factor < 2) return values
    const result = []
    const n = values.length
    const n1 = n - factor
    for (let i = 0; i < n1; i++) {
      let v = 0
      for (let j = 0; j < factor; j++) {
        v += values[i + j]
      }
      result.push(v / factor)
    }
    for (let i = n1; i < n; i++) {
      result.push(values[i])
    }
    return result
  },

  fileSizeNice: function (bytes, precision = 1) {
    let power = 1
    while (bytes > 1024 && power < 6) {
      power++
      bytes /= 1024
    }
    let dim = 'b'
    switch (power) {
      case 2: dim = 'Kb'; break
      case 3: dim = 'Mb'; break
      case 4: dim = 'Gb'; break
      case 5: dim = 'Tb'; break
    }
    return bytes.toFixed(precision) + ' ' + (this.$t ? this.$t(dim) : dim)
  }
}

export default NTMath
