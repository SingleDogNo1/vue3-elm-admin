<template>
  <div class="home">
    {{ name }} -- {{ token }}
    <button class="px-4 py-2 border rounded border-dark-800 btn">button</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { useGlobCss } from '@/hooks/useGlobCss'

export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore()
    const styles = useGlobCss()

    const name = computed(() => store.state.user.name)
    const token = computed(() => store.state.user.token)

    return {
      name,
      token,
      styles,
    }
  },
})
</script>

<style lang="scss">
.btn {
  @include center;

  color: $--color-danger;
}
</style>
