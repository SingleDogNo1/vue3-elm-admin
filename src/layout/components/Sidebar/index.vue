<template>
  <div class="sidebar-container">
    <el-button
      :style="{ bottom: '20px', right: '20px', position: 'fixed' }"
      @click="toggleCollapse"
    >
      toggle
    </el-button>

    <el-scrollbar>
      <el-menu
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from '@/store'
import SidebarItem from './sidebarItem.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem,
  },
  setup() {
    const store = useStore()
    const state = reactive({
      isCollapse: false,
    })

    const permissionRoutes = computed(() => store.getters.permissionRoutes)

    function toggleCollapse() {
      state.isCollapse = !state.isCollapse
    }

    function handleOpen(key, keyPath) {
      console.log(key, keyPath)
    }
    function handleClose(key, keyPath) {
      console.log(key, keyPath)
    }

    return {
      ...toRefs(state),
      permissionRoutes,
      toggleCollapse,
      handleOpen,
      handleClose,
    }
  },
})
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 210px;
}

.el-menu {
  border-right: none;
}

.sidebar-container {
  border-right: 1px solid #ddd;
}
</style>
