<template>
  <div class="redirect">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const state = reactive({
      msg: 'hello, redirect',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.redirect {
  color: red;
}
</style>
