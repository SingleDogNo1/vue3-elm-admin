<template>
  <div v-html="msg"></div>

  <svg-icon name="404" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: '',
  components: { SvgIcon },
  setup() {
    const state = reactive({
      msg: 'hello, example<br />2',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
