<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from '@/router'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const { params, query } = route
    const { path } = params

    router.replace({ path: '/' + path, query })

    return {}
  },
})
</script>
