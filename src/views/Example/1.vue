<template>
  <div>
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '',
  setup() {
    const state = reactive({
      msg: 'hello, example 1',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
