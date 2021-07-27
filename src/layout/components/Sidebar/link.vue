<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { isUrl } from '@/utils/is'

export default defineComponent({
  name: 'SidebarLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isExternal = computed(() => isUrl(props.to))

    const type = computed(() => {
      if (isExternal.value) return 'a'
      return 'router-link'
    })

    function linkProps(to) {
      if (isExternal.value) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        }
      } else {
        return {
          to,
        }
      }
    }

    return {
      isExternal,
      type,
      linkProps,
    }
  },
})
</script>
