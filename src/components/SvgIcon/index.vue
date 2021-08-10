<template>
  <div v-if="isExternal" :style="externalStyle" class="svg-external-icon svg-icon"></div>
  <svg v-else aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { isUrl } from '@/utils/is'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    const isExternal = computed(() => isUrl(props.prefix))
    const externalStyle = computed(() => {
      return {
        background: `url(${props.prefix}) 0/contain no-repeat`,
      }
    })
    return { symbolId, isExternal, externalStyle }
  },
})
</script>

<style lang="scss" scoped>
.svg-icon {
  @include square(1em);
}
</style>
