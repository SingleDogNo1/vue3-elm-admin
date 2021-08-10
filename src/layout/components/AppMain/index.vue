<template>
  <div class="app-main flex-1">
    <router-view v-slot="{ Component, route }">
      <!-- 可以在这里补充 router 跳转的判断，比如除了看板页，其他所有路由均添加左右内边距 -->
      <component
        :is="Component"
        :key="route.name"
        :class="{ 'px-3': !['Dashboard'].includes(route.name) }"
      />
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'AppMain',
  setup() {
    const state = reactive({
      msg: 'hello, app-main',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
