<template>
  <div class="tags-view">
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'TagsView',
  setup() {
    const state = reactive({
      msg: 'hello, tags-view',
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.tags-view {
  color: green;
}
</style>
