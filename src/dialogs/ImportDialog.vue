<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <q-item-label class="text-weight-bold">1. Выберите файл</q-item-label>
        <q-file dense accept=".json" outlined stack-label label="Файл бота (*.json)" v-model="botFile" @update:model-value="openFile">
           <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
          <q-badge v-if="validBot == 1" color="white" class="q-pa-sm" text-color="positive">
            <q-icon name="check_circle" size="14px" class="q-mr-sm" color="positive"/>
            Пригодный формат бота
          </q-badge>
          <q-badge v-if="validBot == 0" color="white" class="q-pa-sm" text-color="negative">
            <q-icon name="error_outline" size="14px" class="q-mr-sm" color="negative"/>
            Непригодный формат бота
          </q-badge>
          <template v-if="validBot == 0">
            <q-icon icon="" color="negative"/>
            <q-item-label>Непригодный формат бота</q-item-label>
          </template>
        <q-item-label class="q-mt-md text-weight-bold">2. Тип импорта</q-item-label>
        <q-list dense>
          <q-item tag="label" v-for="importT in importTypes" v-bind:key="importT.value" style="padding: 0">
            <q-item-section side>
              <q-radio v-model="importType" :val="importT.value"/>
            </q-item-section>
            <q-item-section>
              <q-item-label><q-icon v-if="importT.icon" size="16px" :name="importT.icon"/>{{importT.name}}</q-item-label>
              <q-item-label caption>{{importT.description}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="positive" label="Импортировать" icon="download" align="right" :disable="!bot" @click="doImport(true)"/>
        <q-btn color="blue" outline label="Отмена" @click="doImport(false)"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import B64 from 'src/ntoolkit/b64'
import NTJSON from 'src/ntoolkit/json'

export default defineComponent({
  data: function () {
    return {
      importType: 'new',
      importTypes: [
        { name: 'Поверх текущего бота', value: 'over', description: 'Перезаписывает все данные бота импортированными данными', icon: 'warning' },
        { name: 'Создать нового бота', value: 'new', description: 'Создание нового бота из импортированных данных' }
      ],
      show: false,
      botFile: null,
      botFilePath: '',
      validBot: -1,
      bot: null
    }
  },
  props: {
    openImportDialog: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    openImportDialog: {
      immediate: true,
      handler: function (n, o) {
        this.show = n
      }
    }
  },
  methods: {
    doImport: function (show) {
      const result = { imported: show }
      if (show) {
        result.bot = this.bot
        result.importType = this.importType
      }
      this.$mitt.emit('imported', result)
    },
    openFile: function (path) {
      this.botFilePath = path.name
      let valid = true
      this.bot = null
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const b = e.target.result.split('base64,')[1]
          const txt = B64.b64ToStr(b)
          const json = NTJSON.parseSafe(txt)
          const valids = ['id', 'title', 'content']

          valids.forEach(x => {
            if (typeof json[x] === 'undefined') {
              valid = false
            }
          })
          if (valid) {
            this.bot = json
          }
          // this.openB64(e.target.result)
        } catch {
          valid = false
        }
        this.validBot = valid ? 1 : 0
      }
      reader.readAsDataURL(path)
    }
  }
})
</script>
