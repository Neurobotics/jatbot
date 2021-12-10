<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<template>
  <q-page class="flex flex-center">
    <div v-if="currentUser == null || currentUser.guid == ''" class="q-pa-md">
      <div>
        <div class="row flex-center">
          <q-card>
            <q-tabs
          v-model="tab"
          dense
          class="text-blue"
          active-color="primary"
          indicator-color="blue"
          align="justify"
          narrow-indicator
        >
          <q-tab name="existing" label="Вход" icon="login"/>
          <q-tab name="reg" label="Регистрация"  icon="star"/>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="existing">
            <q-form @submit="loginUser(useremail, userpass)">
            <q-input v-model="useremail" outlined label="Эл.почта" class="q-ma-xs">
              <template v-slot:append>
                <q-icon name="alternate_email" color="primary" />
              </template>
            </q-input>
            <q-input v-model="userpass" outlined type="password" label="Пароль" class="q-ma-xs">
              <template v-slot:append>
                <q-icon name="password" color="primary" />
              </template>
            </q-input>
            <q-btn type="submit" color="positive" class="flex-center q-ma-xs" :disabled="useremail.length < 3 || userpass.length < 3">
              Войти
            </q-btn>
            <q-badge color="red" v-if="loginError != ''">{{$t(loginError)}}</q-badge>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="reg" icon="star">
            <q-form @submit="registerUser(useremail, userpass)">
            <q-input v-model="useremail" outlined label="Эл.почта" class="q-ma-xs">
              <template v-slot:append>
                <q-icon name="alternate_email" color="primary" />
              </template>
            </q-input>
            <q-input v-model="userpass" outlined type="password" label="Пароль" class="q-ma-xs">
              <template v-slot:append>
                <q-icon name="password" color="primary" />
              </template>
            </q-input>
            <q-btn type="submit" color="primary" class="flex-center q-ma-xs"
            :disabled="useremail.length < 3 || userpass.length < 3">
              Создать
            </q-btn>
            <q-badge color="red" v-if="regError">{{$t(regError)}}</q-badge>
            </q-form>
          </q-tab-panel>

        </q-tab-panels>
          </q-card>
          </div>
        <div class="row flex-center">
      </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import Cookies from 'js-cookie'
export default defineComponent({
  name: 'PageLogin',
  data: function () {
    return {
      mode: 'new',
      tab: 'existing',
      useremail: '',
      userpass: '',
      username: '',
      loadingTimer: null,
      currentUser: null,
      loginError: '',
      regError: ''
    }
  },
  created () {
    this.showLoading()
  },
  beforeUnmount () {
  },
  setup () {
    const $q = useQuasar()
    let timer
    return {
      finishLoading () {
        $q.loading.hide()
        clearTimeout(timer)
      },
      showLoading () {
        $q.loading.show({
          message: ''
        })

        // hiding in 3s
        timer = setTimeout(() => {
          $q.loading.hide()
        }, 3000)
      }
    }
  },
  methods: {
    loginUser: function (email, pass) {
      this.loginError = ''
      Cookies.set('user', '')
      const url = 'https://jatbot.neurobotics.ru/ajax/ajax.php?action=user&operation=login&email=' + email + '&pass=' + pass
      console.log(url)
      this.$axios.get(url).then(res => {
        if (res.data && res.data.result === true) {
          Cookies.set('user', res.data.guid)
          console.log('Logged in!', document.cookie)
          window.location.reload()
        } else {
          this.loginError = res.data.error
        }
      })
    },
    registerUser: function (email, pass) {
      this.regError = ''
      Cookies.set('user', '')
      this.$axios.get('https://jatbot.neurobotics.ru/ajax/ajax.php?action=user&operation=create&email=' + email + '&pass=' + pass).then(res => {
        if (res.data && res.data.result === true) {
          console.log('REGED and logged in!', document.cookie)
          Cookies.set('user', res.data.guid)
          window.location.reload()
        } else {
          this.regError = res.data.error
        }
      })
    }
  }
})
</script>
