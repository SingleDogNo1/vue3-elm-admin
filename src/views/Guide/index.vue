<template>
  <el-button class="m-8" icon="el-icon-question" type="primary" @click.prevent.stop="guide">
    {{ t('guide.title') }}
  </el-button>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, getCurrentInstance, watch } from 'vue'
import type Driver from 'driver.js'
import DRIVER from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { cloneDeep } from 'lodash-es'
import steps from './steps'
import { useI18n } from '@/hooks/useI18n'

export default defineComponent({
  name: 'Guide',
  setup() {
    const instance = getCurrentInstance()
    const { t } = useI18n()
    const $i18n = instance?.appContext.config.globalProperties.$i18n
    const state = reactive({
      driver: null as Driver | null,
      steps: null as any[] | null,
    })

    function generateSteps() {
      state.steps = cloneDeep(steps)
      state.steps?.map((value) => {
        value.popover.title = t(value.popover.title)
        value.popover.description = t(value.popover.description)
      })
    }

    function guide() {
      state.driver?.defineSteps(state.steps!)
      state.driver?.start()
    }

    function generateDriver() {
      state.driver = null
      state.driver = new DRIVER({
        doneBtnText: t('guide.done'),
        closeBtnText: t('guide.close'),
        nextBtnText: t('guide.next'),
        prevBtnText: t('guide.prev'),
      })
    }

    watch($i18n.global.locale, () => {
      console.log('切换语言')
      generateSteps()
      generateDriver()
    })

    onMounted(() => {
      generateSteps()
      generateDriver()
    })

    return {
      ...toRefs(state),
      t,
      guide,
      generateDriver,
    }
  },
})
</script>
