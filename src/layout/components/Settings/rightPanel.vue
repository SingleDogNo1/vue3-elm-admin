<template>
  <div ref="settingPanelRef" :class="{ show: show }" class="setting-panel-container">
    <div class="setting-panel-background" @click="closeSettingsPanel"></div>
    <div class="setting-panel">
      <div
        class="handle-button"
        :style="{ top: buttonTop + 'px', 'background-color': theme }"
        @click="show = !show"
      >
        <i :class="show ? 'el-icon-close' : 'el-icon-setting'"></i>
      </div>
      <div class="rightPanel-items">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { useStore } from '@/store/'

export default defineComponent({
  name: 'SettingPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean,
    },
    buttonTop: {
      default: 250,
      type: Number,
    },
  },
  setup(props) {
    const store = useStore()
    const state = reactive({
      show: false,
    })

    const settingPanelRef = ref()

    const theme = computed(() => store.state.settings.theme)

    function closeSidebar(evt) {
      const parent = evt.target.closest('.setting-panel')
      if (!parent) {
        state.show = false
        window.removeEventListener('click', closeSidebar)
      }
    }

    function addEventClick() {
      window.addEventListener('click', closeSidebar)
    }

    function insertToBody() {
      const body = document.querySelector('body') as HTMLBodyElement
      body.insertBefore(settingPanelRef.value, body.firstChild)
    }

    function closeSettingsPanel() {
      state.show = false
    }

    watch(
      () => state.show,
      (value) => {
        if (value && props.clickNotClose) {
          addEventClick()
        }

        if (value) {
          document.body.classList.add('show-setting-panel')
        } else {
          document.body.classList.remove('show-setting-panel')
        }
      }
    )

    onMounted(() => {
      insertToBody()
    })

    onBeforeUnmount(() => {
      settingPanelRef.value.remove()
    })

    return {
      ...toRefs(state),
      settingPanelRef,
      theme,
      addEventClick,
      insertToBody,
      closeSettingsPanel,
    }
  },
})
</script>

<style>
.show-setting-panel {
  position: relative;
  width: calc(100% - 15px);
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.setting-panel-background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.setting-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 40000;
  width: 100%;
  height: 100vh;
  max-width: 260px;
  background: #fff;
  transform: translate(100%);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .setting-panel-background {
    z-index: 20000;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  .setting-panel {
    transform: translate(0);
  }
}

.handle-button {
  position: absolute;
  left: -48px;
  z-index: 0;
  width: 48px;
  height: 48px;
  font-size: 24px;
  line-height: 48px;
  color: #fff;
  text-align: center;
  pointer-events: auto;
  cursor: pointer;
  border-radius: 6px 0 0 6px !important;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
