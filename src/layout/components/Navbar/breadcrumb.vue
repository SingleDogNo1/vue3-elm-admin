<template>
  <el-breadcrumb class="ml-2 flex-1">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
          class="cursor-text text-gray-400"
        >
          {{ t(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ t(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from '@/router'
import { RouteLocationMatched } from 'vue-router'
import { compile } from 'path-to-regexp'
import { useI18n } from '@/hooks/useI18n'

interface State {
  levelList: any[] | null
}

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    const state = reactive<State>({
      levelList: null,
    })

    function isDashboard(route) {
      const name = route?.name
      if (!name) return false
      return name.trim() === 'Dashboard'
    }

    function getBreadcrumb() {
      let matched = route.matched.filter((item) => item.meta && item.meta.title)
      const first = matched[0]

      if (!isDashboard(first)) {
        const dashboard = [
          { path: '/dashboard', meta: { title: 'router.dashboard' } },
        ] as unknown as RouteLocationMatched[]

        matched = dashboard.concat(matched)
      }

      state.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }

    function pathCompile(path) {
      const { params } = route
      var toPath = compile(path)
      return toPath(params)
    }

    function handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(pathCompile(path))
    }

    watch(route, (route) => {
      // 如果重定向页，不要更新面包屑
      if (route.path.startsWith('/redirect/')) return
      getBreadcrumb()
    })

    getBreadcrumb()

    return {
      ...toRefs(state),
      t,
      isDashboard,
      getBreadcrumb,
      pathCompile,
      handleLink,
    }
  },
})
</script>
