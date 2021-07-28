<template>
  <template v-if="hiddenMenu(item)">
    <el-menu-item
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alawysShow
      "
      :index="resolvePath(onlyOneChild.path)"
    >
      <i v-if="onlyOneChild.meta.icon" :class="'el-icon-' + onlyOneChild.meta.icon"></i>
      <template #title>{{ onlyOneChild.meta.title }}</template>
    </el-menu-item>

    <el-submenu v-else :index="resolvePath(item.path)">
      <template #title>
        <i v-if="item.meta.icon" :class="'el-icon-' + item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </template>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { isUrl } from '@/utils/is'
import path from 'path-browserify'

interface State {
  onlyOneChild: RouteRecordRaw | null
}

export default defineComponent({
  name: 'SidebarItem',
  components: {},
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNext: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const state = reactive<State>({
      onlyOneChild: null,
    })

    function hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item: RouteRecordRaw) => {
        if (item.meta?.hidden) {
          return false
        } else {
          state.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        state.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }

    function resolvePath(routePath) {
      if (isUrl(routePath)) {
        return routePath
      }
      if (isUrl(props.basePath)) {
        return props.basePath
      }

      return path.resolve(props.basePath, routePath)
    }

    function hiddenMenu(item) {
      if (!item.meta) {
        return true
      } else {
        if (item.meta.hidden) {
          return false
        } else {
          return true
        }
      }
    }

    return {
      ...toRefs(state),
      hasOneShowingChild,
      resolvePath,
      hiddenMenu,
    }
  },
})
</script>
