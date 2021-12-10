<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<template>
  <q-list dense class="q-pa-xs">
    <q-item v-for="func in content.functions" v-bind:key="func" style="padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 1em">
      <q-card class="q-pa-md">
      <table width="100%">
        <tr>
          <td style="vertical-align: middle; width: auto">function&nbsp;$</td>
          <td style="vertical-align: middle; width: auto; min-width: 100px"><q-input v-model="func.title" dense outlined placeholder="названиеФункции"/></td>
          <td style="vertical-align: middle; width: auto">(</td>
          <td style="vertical-align: middle; width: auto; min-width: 100px"><q-input v-model="func.args" dense outlined placeholder="аргументы"/></td>
          <td style="vertical-align: middle; width: auto">)</td>
          <td style="vertical-align: middle; width: 1%; text-align: right"><q-btn icon="delete" flat class="q-pa-none" color="negative" style="opacity: 0.5" @click="deleteItem(func, content.functions, 'Удалить функцию ' + func.title + '?')"/></td>
        </tr>
        <tr>
          <td>{</td>
        </tr>
        <tr>
          <td colspan="6">
            <q-input v-model="func.code" autogrow outlined placeholder="код функции"/>
          </td>
        </tr>
        <tr>
          <td>}</td>
        </tr>
      </table>
      </q-card>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import ItemManagerMixin from 'src/components/ItemManagerMixin.vue'

export default defineComponent({
  name: 'Functions',
  mixins: [ItemManagerMixin]
})
</script>
