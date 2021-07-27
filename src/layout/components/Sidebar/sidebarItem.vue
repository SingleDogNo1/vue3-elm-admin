<template>
  <div v-if="hiddenMenu(item)">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alawysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <link-item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <link-item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import AppLink from './link.vue'
import LinkItem from './item.vue'
import { isUrl } from '@/utils/is'
import path from 'path-browserify'

interface State {
  onlyOneChild: RouteRecordRaw | null
}

export default defineComponent({
  name: 'SidebarItem',
  components: {
    AppLink,
    LinkItem,
  },
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
