<template>
  <div class="screenFull">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'ScreenFull',
  setup() {
    const state = reactive({
      msg: 'hello, screenFull',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.screenFull {
  color: red;
}
</style>
