<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<template>
  <q-page>
    <template v-if="!person">
      No bot
    </template>
    <template v-else>
      <q-layout view="hHh lpR fFf">
        <q-page-container>
          <div style="max-width: 600px; margin: 0 auto" class="q-pa-md">
          <!-- <div style="min-height: 100px; background: rgba(255, 255, 255, 0.5); white-space: pre; color: #000; max-height: 200px; overflow-y: scroll; padding: 0.5em" v-html="messageLog">
          </div> -->
          <template v-for="msg in messages" v-bind:key="msg.index">
            <q-chat-message
            :name="msg.user ? 'Вы' : person.title"
            :text="[msg.text]"
            :stamp="dt.formatHis(msg.time)"
            :sent="msg.user"/>
          </template>
          <div id="bottom"></div>
            </div>
        </q-page-container>
        <q-footer class="q-pa-xs bg-grey">
          <div class="row">

            <div class="col">
              <q-input dense @keydown="e => { if (e.code == 'Enter' || e.keyCode == '13') { sendMessage() } }" v-model="newMessage" outlined standout placeholder="Сообщение..."/>
            </div>
            <div class="col-auto q-pl-xs">
              <q-btn icon="send" round color="positive" @click="sendMessage()"/>
            </div>
            <!-- <div class="col-auto q-pl-md">
              <q-btn icon="mic" round color="white" flat @click="record()" v-if="!isRecording"/>
              <q-btn icon="stop" round color="red" @click="stop()" v-if="isRecording"/>
          </div> -->
          </div>
        </q-footer>
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
      isRecording: false
    }
  },
  mounted () {
    this.messages.push({ text: 'Напишите что-нибудь', user: false, time: new Date(), index: 0 })
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
      })
    }
    this.init()
  },
  methods: {
    scrollB: function () {
      setTimeout(() => { document.getElementById('bottom').scrollIntoView() }, 200)
    },
    sendMessage: function () {
      if (this.newMessage.trim() === '') return
      this.parseMessage(this.newMessage)
      this.newMessage = ''
      this.scrollB()
    },
    init: function () {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream)
            this.mediaRecorder.ondataavailable = (e) => {
              this.chunks.push(e.data)
            }
            this.mediaRecorder.onstop = (e) => {
              const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' })
              const audioURL = window.URL.createObjectURL(blob)
              this.chunks = []
              this.audios.push(audioURL)
            }
          })
          .catch(function (err) {
            console.log('The following getUserMedia error occured: ' + err)
          })
      } else {
        alert('getUserMedia not supported on your browser!')
      }
    },
    record () {
      this.isRecording = true
      this.mediaRecorder.start()
    },
    stop () {
      this.mediaRecorder.stop()
      this.$q.loading.hide()
      this.isRecording = false
    }
  }
})
</script>
