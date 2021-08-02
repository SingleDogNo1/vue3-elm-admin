<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
    <div class="avatar-wrapper">
      <img :src="avatar" class="w-12 h-12" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item>Dashboard</el-dropdown-item>
        </router-link>
        <a target="_blank" href="https://github.com/lost-dream/vue3-elm-admin/">
          <el-dropdown-item>Github</el-dropdown-item>
        </a>
        <el-dropdown-item divided @click="logout">
          <span :style="{ display: block }">Log Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from '@/store'
import { useRoute, useRouter } from '@/router'

export default defineComponent({
  name: 'Account',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      msg: 'hello, ',
    })
    const avatar = computed(() => store.getters.avatar)

    function logout() {
      store.dispatch('user/logout').then(() => {
        router.push(`/login?redirect=${route.fullPath}`)
      })
    }

    return {
      ...toRefs(state),
      avatar,
      logout,
    }
  },
})
</script>
