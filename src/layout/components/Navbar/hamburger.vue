<template>
  <div class="px-3.5 h-full cursor-pointer" @click="toggleClick">
    <i v-if="isActive" class="text-xl text-gray-800 el-icon-s-fold"></i>
    <i v-else class="text-xl text-gray-800 el-icon-s-unfold"></i>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggleClick'],
  setup(_props, ctx) {
    function toggleClick() {
      ctx.emit('toggleClick')
    }

    return {
      toggleClick,
    }
  },
}
</script>
