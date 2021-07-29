<template>
  <div class="sidebar-container">
    <el-scrollbar>
      <el-menu default-active="1-4-1" class="side-menu" :collapse="!isCollapse" router>
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
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import SidebarItem from './item.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem,
  },
  setup() {
    const store = useStore()

    const permissionRoutes = computed(() => store.getters.permissionRoutes)
    const isCollapse = computed(() => store.getters.sidebar.opened)

    return {
      isCollapse,
      permissionRoutes,
    }
  },
})
</script>

<style scoped lang="scss">
.side-menu:not(.el-menu--collapse) {
  width: 210px;
}

.el-menu {
  border-right: none;
}

.sidebar-container {
  border-right: 1px solid #ddd;
}
</style>
