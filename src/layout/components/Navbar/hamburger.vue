<template>
  <div class="px-3.5 h-full cursor-pointer" @click="handleToggleClick">
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
  setup(_props, { emit }) {
    function handleToggleClick() {
      emit('toggleClick')
    }

    return {
      handleToggleClick,
    }
  },
}
</script>
