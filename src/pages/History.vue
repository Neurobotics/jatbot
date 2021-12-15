<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<template>
  <q-page>
    <template v-if="!person">
      No bot
    </template>
    <template v-else>
      <q-layout view="hHh lpR fFf">
        <q-page-container>
          <q-card class="q-pa-md q-ma-md" v-for="hist in histories" v-bind:key="hist.id">
            <div v-html="hist.content"></div>
          </q-card>
        </q-page-container>
      </q-layout>
    </template>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import BotMixin from 'src/components/BotMixin.vue'
import NTDateTime from 'src/ntoolkit/datetime'

export default defineComponent({
  name: 'PageBotPreview',
  mixins: [BotMixin],
  data: function () {
    return {
      id: '',
      newMessage: '',
      dt: NTDateTime,
      mediaRecorder: null,
      chunks: [],
      audios: [],
      isRecording: false,
      histories: []
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      console.log(this.id)
      this.$axios.get(this.serverUrl + 'person&operation=get' + '&id=' + this.id).then(res => {
        let x = null
        if (res.data && res.data.bot && res.data.bot.length > 0) {
          x = res.data.bot[0]
          x = this.parseBotJson(x)
        }
        this.person = x
        const u = this.serverUrl + 'person&operation=history&GUID=' + this.id
        console.log(u)
        this.$axios.get(u).then(res => {
          console.log(res.data)
          const h = res.data.history
          h.forEach(element => {
            // eslint-disable-next-line
            element.content = '<li>' + element.content.replaceAll("\n", '<li>')
          })
          this.histories = h
        })
      })
    }
  }
})
</script>
