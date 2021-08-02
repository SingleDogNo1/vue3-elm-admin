<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
    <div class="avatar-wrapper">
      <img :src="avatar" class="user-avatar" />
      <i class="el-icon-caret-bottom"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile/index">
          <el-dropdown-item>Profile</el-dropdown-item>
        </router-link>
        <router-link to="/">
          <el-dropdown-item>Dashboard</el-dropdown-item>
        </router-link>
        <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
          <el-dropdown-item>Github</el-dropdown-item>
        </a>
        <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
          <el-dropdown-item>Docs</el-dropdown-item>
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

export default defineComponent({
  name: 'Account',
  setup() {
    const store = useStore()

    const state = reactive({
      msg: 'hello, ',
    })
    const avatar = computed(() => store.getters.avatar)

    return {
      ...toRefs(state),
      avatar,
    }
  },
})
</script>
