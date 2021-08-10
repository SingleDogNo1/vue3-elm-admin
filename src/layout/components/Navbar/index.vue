<template>
  <div class="navbar h-12 overflow-hidden">
    <hamburger
      :is-active="sidebar.opened"
      id="hamburger-container"
      class="leading-12 hover-effect"
      @click="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" />

    <div class="h-full flex">
      <screen-full id="screenfull" class="h-full px-2 leading-12 hover-effect" />

      <lang-select id="lang-select" class="h-full leading-12 text-base hover-effect" />
      <account />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { Breadcrumb, Hamburger, ScreenFull, LangSelect, Account } from './components'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    ScreenFull,
    LangSelect,
    Account,
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
.hover-effect {
  @apply hover:bg-black;
  @apply hover:bg-opacity-5;
}

.navbar {
  position: relative;
  display: flex;
  background: #fff;
  border-bottom: 1px solid $--border-color-default;
  align-items: center;
  justify-content: space-between;

  .hamburger-wrapper {
    &:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
