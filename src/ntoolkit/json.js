// (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru

export const NTJSON = {
  parseSafe: function (json) {
    try {
      return JSON.parse(json)
    } catch (e) {
      return {}
    }
  },
  cloneObject: function (original) {
    return Object.assign({}, original)
  },
  clone: function (original) {
    return JSON.parse(JSON.stringify(original))
  }
}

export default NTJSON
