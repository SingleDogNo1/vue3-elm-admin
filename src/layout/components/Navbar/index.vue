<template>
  <div class="navbar h-12 overflow-hidden">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-wrapper leading-12"
      @click="toggleSideBar"
    />

    <breadcrumb />

    <div class="right-menu">
      <error-log />
      <screen-full />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { Breadcrumb, ErrorLog, Hamburger, ScreenFull } from './components'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Navbar',
  components: {
    Breadcrumb,
    ErrorLog,
    Hamburger,
    ScreenFull,
  },
  setup() {
    const store = useStore()

    const state = reactive({
      msg: 'hello, navbar',
    })

    const sidebar = computed(() => store.getters.sidebar)

    function toggleSideBar() {
      store.dispatch('app/toggleSideBar')
    }

    return {
      ...toRefs(state),
      sidebar,
      toggleSideBar,
    }
  },
})
</script>

<style scoped lang="scss">
.navbar {
  position: relative;
  display: flex;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: space-between;

  .hamburger-wrapper {
    &:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
