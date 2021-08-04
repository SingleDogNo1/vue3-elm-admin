<template>
  <sidebar />
  <div class="main-container">
    <div class="is-fixed">
      <navbar />
      <tags-view />
    </div>
    <app-main />
    <right-panel>
      <settings />
    </right-panel>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Sidebar, Navbar, TagsView, AppMain, RightPanel, Settings } from './components'

export default defineComponent({
  name: 'AppWrapper',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
    RightPanel,
    Settings,
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
  position: relative;
}
</style>
