<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" @scroll="closeMenu">
      <router-link
        :ref="
          (el) => {
            if (el) tagRef[i] = el
          }
        "
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :class="['tags-view-item', { active: isActive(tag) }]"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @click.right.self.prevent="openMenu(tag, $event)"
      >
        {{ t(tag.title) }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="context-menu">
      <li @click="refreshSelectedTag(selectedTag)">{{ t('tagsView.refresh') }}</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        {{ t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">{{ t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags(selectedTag)">{{ t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  watch,
  ref,
  nextTick,
  getCurrentInstance,
} from 'vue'
import ScrollPane from './scrollPanel.vue'
import path from 'path-browserify'
import { useStore } from '@/store'
import { useRoute, useRouter } from '@/router'
import { useI18n } from '@/hooks/useI18n'

export default defineComponent({
  name: 'TagsView',
  components: {
    ScrollPane,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const instance = getCurrentInstance()
    const { t } = useI18n()
    const state = reactive({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [] as any[],
    })
    const tagRef = ref([] as any[])
    const scrollPaneRef = ref()

    const visitedViews = computed(() => store.state.tagsView.visitedViews)
    const routes = computed(() => store.state.permission.routes)

    function isActive(curRoute) {
      return curRoute.path === route.path
    }

    function isAffix(tag) {
      return tag.meta && tag.meta.affix
    }

    function filterAffixTags(routes, basePath = '/') {
      let tags: any[] = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    function initTags() {
      const affixTags = (state.affixTags = filterAffixTags(routes.value))
      for (const tag of affixTags) {
        if (tag.name) {
          store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }

    function addTags() {
      const { name } = route
      if (name) {
        store.dispatch('tagsView/addView', route)
      }
      return false
    }

    function moveToCurrentTag() {
      const tags = tagRef.value
      nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === route.path) {
            scrollPaneRef.value.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== route.fullPath) {
              store.dispatch('tagsView/updateVisitedView', route)
            }
            break
          }
        }
      })
    }

    function refreshSelectedTag(view) {
      store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath,
          })
        })
      })
    }

    function toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }

    function closeSelectedTag(view) {
      store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    function closeOthersTags() {
      router.push(state.selectedTag)
      store.dispatch('tagsView/delOthersViews', state.selectedTag).then(() => {
        moveToCurrentTag()
      })
    }

    function closeAllTags(view) {
      store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (state.affixTags.some((tag) => tag.path === view.path)) {
          return
        }
        toLastView(visitedViews, view)
      })
    }

    function openMenu(tag, e) {
      const $el = instance?.proxy?.$el
      const menuMinWidth = 105
      const offsetLeft = $el.getBoundingClientRect().left
      const offsetWidth = $el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right
      console.log('instance :>> ', left, maxLeft)

      if (left > maxLeft) {
        state.left = maxLeft
      } else {
        state.left = left
      }

      state.top = e.clientY
      state.visible = true
      state.selectedTag = tag
    }

    function closeMenu() {
      state.visible = false
    }

    watch(
      () => state.visible,
      (value) => {
        if (value) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      }
    )

    watch(route, () => {
      addTags()
      moveToCurrentTag()
    })

    onMounted(() => {
      initTags()
      addTags()
    })

    return {
      ...toRefs(state),
      t,
      tagRef,
      scrollPaneRef,
      visitedViews,
      routes,
      closeMenu,
      isActive,
      isAffix,
      filterAffixTags,
      moveToCurrentTag,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      toLastView,
      openMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  height: 34px;
  background: #fff;
  border-bottom: 1px solid $--border-color-default;

  .tags-view-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 26px;
    padding: 0 8px;
    margin-top: 4px;
    margin-left: 5px;
    font-size: 12px;
    line-height: 26px;
    color: $--font-color-primary;
    cursor: pointer;
    background: #fff;
    border: 1px solid $--border-color-default;

    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    ::v-deep(.el-icon-close) {
      @include circle(12px);

      margin-left: 3px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &::before {
        display: inline-block;
        transform: scale(0.6);
      }

      &:hover {
        color: $--color-primary;
        background-color: #fff;
      }
    }

    &.active {
      color: #fff;
      background-color: $--color-primary;
      border-color: $--color-primary;
    }
  }

  .context-menu {
    position: absolute;
    z-index: 3000;
    font-size: 12px;
    color: $--font-color-primary;
    background: #fff;
    border-radius: 4px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);

    li {
      padding: 7px 16px;
      margin: 0;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
