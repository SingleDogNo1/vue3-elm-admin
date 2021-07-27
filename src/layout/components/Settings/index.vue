<template>
  <div class="settings">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Settings',
  setup() {
    const state = reactive({
      msg: 'hello, settings',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.settings {
  color: #1643a5;
}
</style>
