<template>
  <el-tabs class="overflow-hidden mx-3 mt-3" type="border-card">
    <el-tab-pane label="Svg Icons">
      <div class="grid">
        <div
          v-for="item in svgIcons"
          :key="item"
          @click.stop="handleClipboard(generateIconCode(item), $event)"
        >
          <el-tooltip placement="top" :content="generateIconCode(item)">
            <div class="icon-item my-5 cursor-pointer text-center text-3xl">
              <svg-icon :name="item" class="pointer-events-none" />
              <span class="block text-base leading-none mt-3">{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Element-UI Icons">
      <div class="grid">
        <div
          v-for="item in elementIcons"
          :key="item"
          @click.stop="handleClipboard(generateElementIconCode(item), $event)"
        >
          <el-tooltip placement="top" :content="generateElementIconCode(item)">
            <div class="icon-item my-5 cursor-pointer text-center text-3xl">
              <i :class="'el-icon-' + item"></i>
              <span class="block text-base leading-none mt-3">{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElementUIIcons from './element-ui-icons'
import SvgIcons from './svg-icons'
import { useClipboard } from '@/hooks/useClipboard'

export default defineComponent({
  name: 'Icons',
  setup() {
    const elementIcons = ref(ElementUIIcons)
    const svgIcons = ref(SvgIcons)

    function generateIconCode(name) {
      return `<svg-icon name='${name}' />`
    }

    function generateElementIconCode(name) {
      return `<i class='el-icon-${name}' />`
    }

    function handleClipboard(text, event) {
      useClipboard(text, event)
    }

    return {
      elementIcons,
      svgIcons,
      generateIconCode,
      generateElementIconCode,
      handleClipboard,
    }
  },
})
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.icon-item {
  width: 120px;
  height: 85px;
}
</style>
