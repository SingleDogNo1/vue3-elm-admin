<template>
  <div class="cursor-pointer">
    <svg-icon :name="isFullScreen ? 'exit-fullscreen' : 'fullscreen'" @click="handleClick" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, onBeforeUnmount } from 'vue'
import screenFull from 'screenfull'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ScreenFull',
  setup() {
    const state = reactive({
      isFullScreen: false,
    })

    function handleClick() {
      if (!screenFull.isEnabled) {
        ElMessage({
          message: "you browser can't work",
          type: 'warning',
        })
        return false
      }
      screenFull.toggle()
    }

    function change() {
      state.isFullScreen = (screenFull as any).isFullscreen
    }

    function init() {
      if (screenFull.isEnabled) {
        screenFull.on('change', change)
      }
    }
    function destroy() {
      if (screenFull.isEnabled) {
        screenFull.off('change', change)
      }
    }

    onMounted(() => {
      init()
    })
    onBeforeUnmount(() => {
      destroy()
    })

    return {
      ...toRefs(state),
      handleClick,
      change,
      init,
      destroy,
    }
  },
})
</script>
