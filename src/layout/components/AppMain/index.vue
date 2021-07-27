<template>
  <div class="app-main">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'AppMain',
  setup() {
    const state = reactive({
      msg: 'hello, app-main',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.app-main {
  color: rgb(255, 0, 119);
}
</style>
