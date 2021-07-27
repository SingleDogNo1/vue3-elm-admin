<template #title>
  <i v-if="icon" :class="'el-icon-' + icon"></i>
  <span v-if="title">{{ title }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
})
</script>
