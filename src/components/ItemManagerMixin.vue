<!-- (C) 2021 Neurobotics, Dmitry Konyshev, d.konyshev@neurobotics.ru -->

<script>
import { defineComponent } from 'vue'
import { Dialog } from 'quasar'

export default defineComponent({
  props: {
    content: {
      type: Object,
      default: function () {
        return {
          functions: [],
          responses: [],
          datasets: []
        }
      }
    }
  },
  methods: {
    deleteItem: function (item, items, title = '') {
      const index = items.indexOf(item)
      if (index >= 0) {
        Dialog.create({
          message: title !== '' ? title : 'Удалить?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          items.splice(index, 1)
        })
      }
    }
  }
})
</script>
