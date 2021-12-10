<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->
<template>
  <q-list dense separator>
    <q-item v-for="dataset in content.datasets" v-bind:key="dataset" style="padding-left: 0 !important; padding-right: 0 !important">
      <q-item-section style="justify-content: flex-start">
        <q-input v-model="dataset.title" outlined prefix="#" suffix="#"/>
        <q-btn icon="delete" flat class="q-pa-none" color="negative" style="opacity: 0.5" @click="deleteItem(dataset, content.dataset)"/>
      </q-item-section>
      <q-item-section style="justify-content: flex-start">
        <q-input v-model="dataset.entries" autogrow outlined input-style="padding-top: 6px"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import ItemManagerMixin from 'src/components/ItemManagerMixin.vue'

export default defineComponent({
  name: 'DataSets',
  mixins: [ItemManagerMixin]
})
</script>
