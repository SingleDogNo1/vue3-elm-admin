<template>
  <div v-html="msg"></div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '',
  setup() {
    const state = reactive({
      msg: 'hello, example<br />2',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
