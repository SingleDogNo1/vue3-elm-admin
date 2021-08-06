<template>
  <el-dropdown trigger="click" @command="handleChangeLang">
    <div class="px-2 hover-effect">
      <svg-icon name="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- ! 循环他妈的到底有什么问题，艹 FUCK -->
        <!-- <el-dropdown-item
          v-for="(item, i) in LangOptions"
          :key="i"
          :disabled="lang === item.value"
          :command="item.value"
        >
          {{ item.value }} {{ lang }}
        </el-dropdown-item> -->
        <el-dropdown-item :disabled="lang === 'zh_CN'" command="zh_CN">中文</el-dropdown-item>
        <el-dropdown-item :disabled="lang === 'en'" command="en">英文</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { changeLocale } from '@/locales'
import { useStore } from '@/store'

export default defineComponent({
  name: 'LangSelect',
  setup() {
    const store = useStore()
    const lang = computed(() => store.state.locale.locale)
    const state = reactive({
      LangOptions: [
        { label: '中文', value: ' zh_CN' },
        { label: '英文', value: ' en' },
      ],
    })
    function handleChangeLang(value) {
      changeLocale(value)
    }

    return {
      ...toRefs(state),
      lang,
      handleChangeLang,
    }
  },
})
</script>

<style lang="scss" scoped>
.hover-effect {
  @apply hover:bg-black;
  @apply hover:bg-opacity-5;
}
</style>
