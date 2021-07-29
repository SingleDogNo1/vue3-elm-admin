<template>
  <sidebar />
  <div class="main-container">
    <div class="is-fixed">
      <navbar />
      <tags-view />
    </div>
    <app-main />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Sidebar, Navbar, TagsView, AppMain } from './components'

export default defineComponent({
  name: 'AppWrapper',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
  },
  setup() {
    const state = reactive({
      msg: 'hello, app-wrapper',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.main-container {
  flex: 1;
}
</style>
