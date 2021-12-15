<script>
import { defineComponent } from 'vue'
import NTJSON from 'src/ntoolkit/json'
import NTDateTime from 'src/ntoolkit/datetime'

export default defineComponent({
  data: function () {
    return {
      serverUrl: 'https://jatbot.neurobotics.ru/ajax/ajax.php?action=',
      person: null,
      messageLog: '',
      messages: [],
      messageCount: 0,
      externalPreprocess: false,
      externalPostprocess: false,
      externalAnswer: false,
      externalServer: 'http://127.0.0.1:1807',
      sid: this.newGuid()
    }
  },
  methods: {
    newGuid: function () {
      let d = new Date().getTime() // Timestamp
      let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0 // Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 // random number between 0 and 16
        if (d > 0) { // Use timestamp until depleted
          r = (d + r) % 16 | 0
          d = Math.floor(d / 16)
        } else { // Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0
          d2 = Math.floor(d2 / 16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
    },
    manageNewlines: function (txt) {
      // eslint-disable-next-line
      return txt.replaceAll('<br/>', "\n")
    },
    parseBotJson: function (x) {
      // eslint-disable-next-line
      const c = x.content.replaceAll("\n", "<br/>")
      x.description = x.description ? this.manageNewlines(x.description) : ''
      const content = NTJSON.parseSafe(c)
      if (!content.responses) content.responses = []
      content.responses.forEach(r => {
        r.enabled = typeof r.enabled !== 'undefined' ? r.enabled : true
        r.input = r.input ? this.manageNewlines(r.input) : ''
        r.output = r.output ? this.manageNewlines(r.output) : ''
      })
      if (!content.functions) content.functions = []
      content.functions.forEach(f => {
        f.title = f.title ? f.title : ''
        f.code = f.code ? this.manageNewlines(f.code) : ''
        f.args = f.args ? this.manageNewlines(f.args) : ''
      })
      if (!content.datasets) content.datasets = []
      content.datasets.forEach(d => {
        d.title = d.title ? d.title : ''
        d.entries = d.entries ? this.manageNewlines(d.entries) : ''
      })
      content.unanswers = content.unanswers ? this.manageNewlines(content.unanswers) : ''
      content.preprocess = content.preprocess ? this.manageNewlines(content.preprocess) : ''
      content.postprocess = content.postprocess ? this.manageNewlines(content.postprocess) : ''
      x.content = content
      return x
    },
    makeHistory: function (input, txt) {
      const line = (input ? '>' : '<') + ' [' + NTDateTime.formatYmdHis(new Date()) + '] ' + txt
      const data = {}
      // data.log = line
      this.$axios({
        url: this.serverUrl + 'person_history&sid=' + this.sid + '&person=' + this.person.GUID + '&user=' + this.user + '&log=' + line,
        method: 'POST',
        data: data
      })
    },
    parseMessage: function (val) {
      const msg = this.performPreprocess(val)

      this.messageLog = '<div class="input">&gt; ' + msg + '</div>' + this.messageLog
      this.messages.push({ text: msg, user: true, time: new Date(), index: this.messageCount++ })
      this.makeHistory(true, msg)
      const funcLocalPostproc = (m, ans) => {
        const ans3 = this.performPostprocess(m, ans)
        this.messageLog = '<div class="output">' + ans3 + '</div>' + this.messageLog
        this.messages.push({ text: ans3, user: false, time: new Date(), index: this.messageCount++ })
        this.makeHistory(false, ans3)
      }
      const funcLocalAnswer = (m) => {
        const ans2 = this.performAnswer(m)
        funcLocalPostproc(m, ans2)
      }

      if (this.externalAnswer) {
        this.$axios.get(this.externalServer + '?answer=' + msg).then(res => {
          funcLocalPostproc(msg, res.data)
        }).catch(() => {
          funcLocalAnswer(msg)
        })
      } else {
        funcLocalAnswer(msg)
      }
    },
    applyDS: function (txt) {
      const p = this.person
      if (typeof txt === 'undefined') txt = ''
      if (!p || txt === '') return txt
      const ds = p.content.datasets
      for (let i = 0; i < ds.length; i++) {
        const dataset = ds[i]
        if (!dataset) continue
        const inclusion = '#' + dataset.title.toLowerCase() + '#'
        while (txt.indexOf(inclusion) >= 0) {
          const r = this.$jat.getRandomFromLines(dataset.entries)
          txt = txt.replace(inclusion, r)
        }
      }
      return txt
    },
    performPreprocess: function (val) {
      const p = this.person
      if (!p) return
      let msg = val.trim().toLowerCase().replaceAll(',', ' ').replaceAll('.', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ')
      // Pre-processing
      if (p.content.preprocess) {
        // eslint-disable-next-line
        const f = new Function('return ' + 'function (input) { ' + p.content.preprocess + '}')()
        try {
          const ans = f(msg)
          msg = ans
        } catch (e) {
          console.error(e)
        }
      }
      return msg
    },
    performAnswer: function (msg) {
      const p = this.person
      const responses = p.content.responses
      const n = responses.length
      let foundAnswer = false
      let answer = ''
      // Looking for strict
      for (let i = 0; i < n; i++) {
        const r = responses[i]
        if (r.enabled === false) continue
        const inputs = r.input.split('\n')
        for (let j = 0; j < inputs.length; j++) {
          const input = inputs[j].toLowerCase().trim()
          if (msg === input) {
            foundAnswer = true
            answer = this.$jat.getRandomFromLines(r.output)
            break
          }
        }
        if (foundAnswer) break
      }
      // Looking for responses inside input
      if (!foundAnswer) {
        for (let i = 0; i < n; i++) {
          const r = responses[i]
          if (r.enabled === false) continue
          const inputs = r.input.split('\n')
          for (let j = 0; j < inputs.length; j++) {
            const input = inputs[j].toLowerCase().trim()
            if (input === '') continue
            if (msg.indexOf(input) >= 0) {
              foundAnswer = true
              answer = this.$jat.getRandomFromLines(r.output)
              break
            }
          }
          if (foundAnswer) break
        }
      }
      if (answer === '') {
        console.log('No answer')
        answer = this.$jat.getRandomFromLines(p.content.unanswers)
      }
      return answer
    },
    performPostprocess: function (msg, answer) {
      const p = this.person
      if (p.content.postprocess) {
        // eslint-disable-next-line
        const f = new Function('return ' + 'function (answer, input) { ' + p.content.postprocess + '}')()
        try {
          const ans = f(answer, msg)
          answer = ans
        } catch (e) {
          console.error(e)
        }
      }
      answer = this.applyDS(answer)
      answer = this.applyFunctions(answer)
      return answer
    },
    applyFunctions: function (txt) {
      const p = this.person
      if (typeof txt === 'undefined') txt = ''
      if (!p || txt === '') return txt
      const funcs = p.content.functions
      for (let i = 0; i < funcs.length; i++) {
        const func = funcs[i]
        if (!func || !func.title || !func.code) continue
        const inclusion = '$' + func.title + '('
        while (txt.indexOf(inclusion) >= 0) {
          const ind = txt.lastIndexOf(inclusion)
          const ind2 = txt.indexOf(')', ind + inclusion.length)
          const inc = txt.substring(ind, ind2 + 1)
          // console.log('F', inc)
          // eslint-disable-next-line
          const f = new Function('return ' + 'function (' + func.args + ') { ' + func.code + '}')()
          let result = ''
          try {
            const arg = inc.substring(inclusion.length, inc.length - 1)
            console.log('arg', arg)
            const ans = f(arg)
            result = ans
            console.log('return', ans)
          } catch (e) {
            console.error(e)
          }
          txt = txt.replace(inc, result)
        }
      }
      return txt
    }
  }
})
</script>
