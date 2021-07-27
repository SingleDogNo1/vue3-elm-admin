<template>
  <div class="navbar">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Navbar',
  setup() {
    const state = reactive({
      msg: 'hello, navbar',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.navbar {
  color: blue;
}
</style>
