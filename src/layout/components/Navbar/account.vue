<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
    <div class="avatar-wrapper">
      <img :src="avatar" class="w-12 h-12" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/">
          <el-dropdown-item>{{ t('navBar.dashboard') }}</el-dropdown-item>
        </router-link>
        <a target="_blank" href="https://github.com/lost-dream/vue3-elm-admin/">
          <el-dropdown-item>Github</el-dropdown-item>
        </a>
        <el-dropdown-item divided @click="logout">
          <span class="block">{{ t('navBar.logout') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { useRoute, useRouter } from '@/router'
import { useI18n } from '@/hooks/useI18n'

export default defineComponent({
  name: 'Account',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()

    const avatar = computed(() => store.getters.avatar)

    function logout() {
      store.dispatch('user/logout').then(() => {
        router.push(`/login?redirect=${route.fullPath}`)
      })
    }

    return {
      t,
      avatar,
      logout,
    }
  },
})
</script>
