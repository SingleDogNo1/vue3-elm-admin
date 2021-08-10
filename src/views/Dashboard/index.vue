<template>
  <div class="h-full flex">
    <button>13123123</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const state = reactive({
      componentsList: [
        {
          type: 'flow',
          icon: 'tree',
          name: '我的流程',
        },
        {
          type: 'reminder',
          icon: 'form',
          name: '提醒事项',
        },
        {
          type: 'table_statistical',
          icon: 'chart',
          name: '统计表',
        },
        {
          type: 'table_detail',
          icon: 'table',
          name: '明细表',
        },
        {
          type: 'table_data_manage',
          icon: 'tree-table',
          name: '数据管理表',
        },
      ],
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
