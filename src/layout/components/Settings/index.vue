<template>
  <div class="drawer-container">
    <h3 class="drawer-title">Page style setting</h3>

    <div class="drawer-item">
      <span>Open Tags-View</span>
      <el-switch v-model="tagsView" class="drawer-switch" />
    </div>

    <div class="drawer-item">
      <span>Fixed Header</span>
      <el-switch v-model="fixedHeader" class="drawer-switch" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Settings',
  setup() {
    const store = useStore()

    const fixedHeader = computed({
      get: () => store.state.settings.fixedHeader,
      set: (value) => {
        store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value,
        })
      },
    })

    const tagsView = computed({
      get: () => store.state.settings.tagsView,
      set: (value) => {
        store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value,
        })
      },
    })

    return {
      fixedHeader,
      tagsView,
    }
  },
})
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.85);
  }

  .drawer-item {
    padding: 12px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
