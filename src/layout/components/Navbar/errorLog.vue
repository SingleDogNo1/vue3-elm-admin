<template>
  <div class="errorLog">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'ErrorLog',
  setup() {
    const state = reactive({
      msg: 'hello, errorLog',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.errorLog {
  color: red;
}
</style>
