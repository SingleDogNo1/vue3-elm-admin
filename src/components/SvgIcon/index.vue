<template>
  <div v-if="isExternal" :style="externalStyle" class="svg-external-icon svg-icon"></div>
  <svg v-else aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" :fill="fillColor" />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { isUrl } from '@/utils/is'
import { useGlobCss } from '@/hooks/useGlobCss'

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
    color: {
      type: String,
    },
  },
  setup(props) {
    const { textColor } = useGlobCss()
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    const isExternal = computed(() => isUrl(props.prefix))
    const externalStyle = computed(() => {
      return {
        background: `url(${props.prefix}) 0/contain no-repeat`,
      }
    })
    const fillColor = computed(() => props.color ?? textColor)
    return { symbolId, isExternal, externalStyle, textColor, fillColor }
  },
})
</script>

<style lang="scss" scoped>
.svg-icon {
  @include square(1em);
}
</style>
