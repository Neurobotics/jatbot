<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->
<template>
  <q-list dense separator>
    <q-item v-for="response in content.responses" v-bind:key="response" style="padding-left: 0 !important; padding-right: 0 !important">
      <q-item-section side style="justify-content: flex-start">
        <q-checkbox v-model="response.enabled" disable dense/>
        <q-btn icon="delete" flat class="q-pa-none" color="negative" style="opacity: 0.5"/>
      </q-item-section>
      <q-item-section style="justify-content: flex-start">
        <q-input v-model="response.input" autogrow outlined input-style="padding-top: 6px"/>
      </q-item-section>
      <q-item-section style="justify-content: flex-start">
        <q-input v-model="response.output" autogrow outlined input-style="padding-top: 6px"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Responses',
  props: {
    content: {
      type: Array,
      default: () => []
    }
  }
})
</script>
