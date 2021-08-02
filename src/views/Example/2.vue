<template>
  <div v-html="msg"></div>

  <svg-icon name="404" />
  <div>{{ t('login.password') }}</div>
</template>

<script lang="ts">
import { useI18n } from '@/hooks/useI18n'
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '',
  setup() {
    const { t } = useI18n()
    const state = reactive({
      msg: 'hello, example<br />2',
    })

    return {
      ...toRefs(state),
      t,
    }
  },
})
</script>
