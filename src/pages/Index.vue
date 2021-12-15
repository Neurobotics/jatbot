<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<template>
   <q-layout view="hHh lpR fFf" v-if="user">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          <q-select :options="personsOptions" v-model="personGUID" outlined map-options emit-value/>
        </q-toolbar-title>

        <q-btn dense flat round icon="save" @click="save()" id="btnSave" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered style="background: #CCC">
      <q-list>
        <q-item clickable @click="newBot()">
          <q-item-section side>
            <q-icon name="add" color="positive"/>
          </q-item-section>
          <q-item-section>
            Новый робот
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item clickable @click="downloadBot()">
          <q-item-section side>
            <q-icon name="upload" color="blue"/>
          </q-item-section>
          <q-item-section>
            Экспорт робота в файл
          </q-item-section>
        </q-item>
        <q-item clickable disable>
          <q-item-section side>
            <q-icon name="download" color="blue"/>
          </q-item-section>
          <q-item-section>
            Импорт робота из файла
          </q-item-section>
        </q-item>
        <q-item clickable @click="newWindow('/#/history/?id=' + person.GUID)">
          <q-item-section side>
            <q-icon name="history" color="blue"/>
          </q-item-section>
          <q-item-section>
            История чатов
          </q-item-section>
        </q-item>
        <q-item clickable @click="removeBot()">
          <q-item-section side>
            <q-icon name="remove" color="blue"/>
          </q-item-section>
          <q-item-section>
            Удалить этого робота
          </q-item-section>
        </q-item>
        <q-item clickable @click="newWindow('/#/bot/?id=' + person.GUID)">
          <q-item-section side>
            <q-icon name="preview" color="blue"/>
          </q-item-section>
          <q-item-section>
            Просмотр бота
          </q-item-section>
        </q-item>
         <q-separator/>
        <q-item clickable @click="newWindow('https://jatbot.neurobotics.ru/#/bot/?id=36A7B904-E465-4664-8A1F-46C74BF7')">
            <q-item-section side>
              <q-icon name="support_agent" color="black"/>
            </q-item-section>
            <q-item-section>
              Тех.поддержка
          </q-item-section>
        </q-item>
         <q-item clickable @click="newWindow('https://github.com/Neurobotics/jatbot/')">
            <q-item-section side>
              <q-avatar square size="24px" >
                <img src="icons/github.svg"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              Код на GitHub
          </q-item-section>
        </q-item>
        <q-item clickable @click="newWindow('https://neurobotics.ru')">
            <q-item-section side>
              <q-avatar square size="24px" >
                <img src="icons/neurobotics-logo-badge.svg" style="width: 20px; height: 20px;"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              Neurobotics: Alma mater
          </q-item-section>
        </q-item>
      <q-separator/>
        <q-item clickable @click="logout()">
          <q-item-section side>
            <q-icon name="logout" color="red"/>
          </q-item-section>
          <q-item-section>
            Выйти
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <template v-if="person">

          <q-tabs v-model="tabModel">
            <q-tab name="settings" label="* Settings"/>
            <q-tab name="responses" label="> Responses"/>
            <q-tab name="functions" label="$Functions()"/>
            <q-tab name="datasets" label="#Datasets#"/>
            <q-tab name="unanswers" label="?Unanswers"/>
            <q-tab name="processing" label="//Processing"/>
          </q-tabs>

          <q-tab-panels v-model="tabModel">
            <q-tab-panel name="settings">
              <q-input dense stack-label label="Название" placeholder="[Без названия]" v-model="person.title" class="q-ma-md"/>
              <q-input dense stack-label label="Описание" placeholder="[Без описания]" v-model="person.description" class="q-ma-md" autogrow/>
              <q-separator/>
              <q-input dense stack-label label="Приветственная фраза" placeholder="[Первая фраза в чате]" v-model="person.settings.startPhrase" class="q-ma-md" autogrow/>
              <q-separator/>
              <q-toggle v-model="person.settings.integration" label="Интеграция"/>
              <q-card v-show="person.settings.integration" class="q-pa-md">
                <q-input v-model="person.settings.externalServer" label="Сервер" stack-label outlined/><br/>
                <q-toggle v-model="person.settings.externalAnswer" :label="'Подменять ответ (' + person.settings.externalServer + '/answer=XXX)'"/><br/>
                <q-toggle v-model="person.settings.externalPreprocess" :label="'Подменять предобработку (' + person.settings.externalServer + '/preprocess=XXX)'"/><br/>
                <q-toggle v-model="person.settings.externalPostprocess" :label="'Подменять постобработку (' + person.settings.externalServer + '/postprocess=XXX)'"/>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="responses">
              <Responses :content="person.content"/>
              <q-btn icon="add" color="positive" flat size="md" @click="person.content.responses.push({input: '', output: ''})"/>
            </q-tab-panel>
            <q-tab-panel name="datasets">
              <DataSets :content="person.content"/>
              <q-btn icon="add" color="positive" flat size="md" @click="person.content.datasets.push({title: '', entries: ''})"/>
            </q-tab-panel>
            <q-tab-panel name="functions">
              <Functions :content="person.content"/>
              <q-btn icon="add" color="positive" flat size="md" @click="person.content.functions.push({title: '', code: ''})"/>
            </q-tab-panel>
            <q-tab-panel name="unanswers">
              <q-input v-model="person.content.unanswers" autogrow outlined input-style="padding-top: 6px"/>
            </q-tab-panel>
             <q-tab-panel name="processing">
                <div>
                function preprocess (input) {
                <q-input v-model="person.content.preprocess" autogrow outlined/>
                }
                </div>
                <br/>
                function postprocess (answer, input) {
                <q-input v-model="person.content.postprocess" autogrow outlined input-style="padding-top: 6px"/>
                }
            </q-tab-panel>
          </q-tab-panels>
      </template>
    </q-page-container>

    <q-footer class="q-pa-xs">
      <div style="min-height: 100px; background: rgba(255, 255, 255, 0.5); white-space: pre; color: #000; max-height: 200px; overflow-y: scroll; padding: 0.5em" v-html="messageLog">
      </div>
      <q-input prefix=">" dense @keydown="e => { if (e.code == 'Enter') { parseMessage(newMessage); newMessage = ''} }" v-model="newMessage" class="bg-white" outlined placeholder="Сообщение..."/>
    </q-footer>

  </q-layout>

  <q-layout v-else>
    <Login/>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import Responses from 'src/components/Responses.vue'
import DataSets from 'src/components/DataSets.vue'
import Functions from 'src/components/Functions.vue'
import Login from 'src/components/Login.vue'
import Cookies from 'js-cookie'
import BotMixin from 'src/components/BotMixin.vue'
import { Dialog } from 'quasar'

export default defineComponent({
  name: 'PageIndex',
  components: {
    Responses,
    DataSets,
    Functions,
    Login
  },
  mixins: [BotMixin],
  data: function () {
    return {
      persons: [],
      personGUID: '',
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      tabModel: 'responses',
      extendedSettings: false,
      newMessage: '',
      user: Cookies.get('user')
    }
  },
  watch: {
    personGUID: {
      immediate: true,
      handler: function (n, o) {
        const p = this.persons.filter(x => x.GUID === this.personGUID)
        if (p.length > 0) {
          this.person = p[0]
        } else {
          this.person = null
        }
      }
    }
  },
  mounted () {
    this.$axios.get(this.serverUrl + 'person&operation=list' + '&user=' + this.user).then(res => {
      const persons = res.data.persons
      persons.forEach(x => {
        x = this.parseBotJson(x)
      })
      this.persons = persons
      if (persons.length > 0) {
        this.personGUID = persons[0].GUID
      }
    })
    window.addEventListener('keydown', e => {
      if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault()
        this.save()
      }
    })

    setInterval(() => {
      if (this.person) {
        this.save()
        document.getElementById('btnSave').style.background = '#39A'
        setTimeout(() => {
          document.getElementById('btnSave').style.background = ''
        }, 300)
      }
    }, 10000)
  },
  methods: {
    downloadBot: function () {
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(new Blob([JSON.stringify(this.person, null, 2)], { type: 'text/plain' }))
      a.download = this.person.title + '.json'
      a.click()
    },
    newBot: function () {
      const u = this.serverUrl + 'person&operation=create&user=' + this.user
      this.$axios.get(u).then(res => {
        window.location.reload()
      })
    },
    removeBot: function () {
      if (!this.person) return
      Dialog.create({
        message: 'Удалить бота "' + this.person.title + '"?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const u = this.serverUrl + 'person&operation=remove&GUID=' + this.person.GUID + '&user=' + this.user
        this.$axios.get(u).then(res => {
          window.location.reload()
        })
      })
    },
    prepareForSave: function (txt) {
      return txt.replaceAll('"', '\\"').replaceAll('\'', '\\\'')
    },
    logout () {
      Cookies.set('user', '')
      window.location.reload()
    },
    getPersonJson () {
      if (!this.person) return null
      const p = this.person
      const params = {}
      params.GUID = p.GUID
      params.title = p.title
      params.description = p.description
      params.content = JSON.stringify(p.content).replaceAll('"', '\\"').replaceAll('\'', '\\\'')
      params.settings = JSON.stringify(p.settings)
      return params
    },
    save: function () {
      const p = this.getPersonJson()
      if (p === null) return
      const params = new URLSearchParams(p)
      const u = this.serverUrl + 'person&operation=save&GUID=' + this.person.GUID
      this.$axios({
        url: u,
        method: 'post',
        data: params
      }).then(res => {
        // console.log(res.data)
      })
    },
    newWindow: function (url) {
      window.open(url, '_blank')
    }
  },
  computed: {
    personsOptions: function () {
      const options = []
      this.persons.forEach(x => {
        options.push({ label: x.title ? x.title : '[Без названия]', value: x.GUID })
      })
      return options
    }
  }
})
</script>

<style>
.input {
  color: #159;
  margin-bottom: 0.5em;
}
.output {
  font-weight: bold;
}
</style>
