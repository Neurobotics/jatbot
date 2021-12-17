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
            :text-html="true"
            :stamp="dt.formatHis(msg.time)"
            :sent="msg.user"/>
          </template>
          <div id="bottom"></div>
            </div>
        </q-page-container>

         <q-page-sticky position="bottom-right" :offset="[5, 5]">
            <q-btn icon="voice_over_off" round color="grey" flat @click="useTTS = true" v-if="!useTTS" class="q-mb-sm"/>
            <q-btn icon="record_voice_over" round color="blue" @click="useTTS = false" v-if="useTTS" class="q-mb-sm"/><br/>
            <q-btn icon="mic" round color="accent" @click="record()" v-if="!isRecording"/>
            <q-btn icon="stop" round color="red" @click="stop()" v-if="isRecording"/>
         </q-page-sticky>

        <q-footer class="q-pa-xs bg-grey">
          <div class="row">

            <div class="col">
              <q-input dense @keydown="e => { if (e.code == 'Enter' || e.keyCode == '13') { sendMessage() } }" v-model="newMessage" outlined standout placeholder="Сообщение..."/>
            </div>
            <div class="col-auto q-pl-xs">
              <q-btn icon="send" round color="positive" @click="sendMessage()"/>
            </div>
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
      isRecording: false,
      useTTS: true,
      ttsAudio: null
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.$axios.get(this.serverUrl + 'person&operation=get' + '&id=' + this.id).then(res => {
        let x = null
        if (res.data && res.data.bot && res.data.bot.length > 0) {
          x = res.data.bot[0]
          x = this.parseBotJson(x)
        }
        this.person = x
        this.messages.push({ text: this.applyFunctions(this.applyDS(x.settings.startPhrase)), user: false, time: new Date(), index: 0 })
      })
    }
    this.init()
    this.$mitt.on('answer', (txt) => {
      if (this.useTTS) {
        this.tts(txt)
      }
    })
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
    stt: function (blob) {
      const url = 'https://neurobotics.ru/ajax/recognition.php?lang=ru-RU&format=b64'
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        this.$axios.post(url, base64data.split('base64,')[1]).then(res => {
          const txt = res.data.result
          if (txt !== '') this.parseMessage(txt)
          else this.addMessage('[неразборчиво]', true)
        })
      }
    },
    tts: function (text) {
      const url = 'https://neurobotics.ru/ajax/speech.php?text=' + text
      if (!this.ttsAudio) {
        this.ttsAudio = new Audio()
        this.ttsAudio.autoplay = true
      }
      this.ttsAudio.src = url
      this.ttsAudio.play()
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
              this.stt(blob)
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
