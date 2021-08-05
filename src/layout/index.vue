<template>
  <sidebar />
  <div :class="['main-container', { 'fixed-container': fixedHeader }]">
    <div :class="{ 'fixed-header': fixedHeader }">
      <navbar />
      <tags-view v-if="needTagsView" />
    </div>
    <app-main :class="{ 'fixed-content': fixedHeader, 'has-tags': needTagsView }" />
    <right-panel v-if="showSettings">
      <settings />
    </right-panel>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Sidebar, Navbar, TagsView, AppMain, RightPanel, Settings } from './components'
import { useStore } from '@/store'

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
    const store = useStore()

    const fixedHeader = computed(() => store.state.settings.fixedHeader)
    const showSettings = computed(() => store.state.settings.showSettings)
    const needTagsView = computed(() => store.state.settings.tagsView)

    return {
      fixedHeader,
      showSettings,
      needTagsView,
    }
  },
})
</script>

<style lang="scss" scoped>
.main-container {
  flex: 1;
  position: relative;
  overflow: hidden auto;

  &.fixed-container {
    height: 100%;
    overflow: hidden;
  }

  .fixed-header {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
  }

  .fixed-content {
    height: 100%;
    padding-top: 48px;
    overflow: hidden auto;

    &.has-tags {
      padding-top: 82px;
    }
  }
}
</style>
