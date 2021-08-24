<template>
  <div ref="LayoutRef" class="grid-layout" :style="mergedStyle">
    <slot></slot>
    <grid-item
      v-show="isDragging"
      :x="placeholder.x"
      :y="placeholder.y"
      :w="placeholder.w"
      :h="placeholder.h"
      :i="placeholder.i"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRefs,
  toRef,
  ref,
  onMounted,
  nextTick,
  provide,
  onBeforeUnmount,
  watch,
} from 'vue'
import GridItem from './item.vue'
import mitt from 'mitt'
import elementResizeDetectorMaker from 'element-resize-detector'

import type { Breakpoints } from './helpers/responsiveUtils'
import type { Layout, LayoutItem } from './helpers/utils'

import {
  bottom,
  compact,
  getLayoutItem,
  moveElement,
  validateLayout,
  cloneLayout,
  getAllCollisions,
} from './helpers/utils'

import {
  getBreakpointFromWidth,
  getColsFromBreakpoint,
  findOrGenerateResponsiveLayout,
} from './helpers/responsiveUtils'

import { addWindowEventListener, removeWindowEventListener } from './helpers/DOM'

interface State {
  erd: any
  width?: any
  mergedStyle: { height: string }
  lastLayoutLength: number
  isDragging: boolean
  placeholder: Placeholder
  layouts: { [key: string]: any }
  lastBreakpoint?: any
  originalLayout?: Layout
}

interface Placeholder {
  x: number
  y: number
  w: number
  h: number
  i: number
}

export default defineComponent({
  name: 'GridLayout',
  components: {
    GridItem,
  },
  props: {
    autoSize: {
      type: Boolean,
      default: true,
    },
    colNum: {
      type: Number,
      default: 12,
    },
    rowHeight: {
      type: Number,
      default: 150,
    },
    maxRows: {
      type: Number,
      default: Infinity,
    },
    margin: {
      type: Array as PropType<number[]>,
      default: () => [10, 10],
    },
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isResizable: {
      type: Boolean,
      default: true,
    },
    isMirrored: {
      type: Boolean,
      default: false,
    },
    useCssTransforms: {
      type: Boolean,
      default: true,
    },
    verticalCompact: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: Array as PropType<Layout>,
      required: true,
    },
    responsive: {
      type: Boolean,
      default: false,
    },
    responsiveLayouts: {
      type: Object,
      default: () => {},
    },
    breakpoints: {
      type: Object as PropType<Breakpoints>,
      default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }),
    },
    cols: {
      type: Object as PropType<Breakpoints>,
      default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }),
    },
    preventCollision: {
      type: Boolean,
      default: false,
    },
    useStyleCursor: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'layout-updated',
    'breakpoint-changed',
    'update:layout',
    'layout-created',
    'layout-mounted',
    'layout-ready',
  ],
  setup(props, { emit }) {
    const layout = toRef(props, 'layout')
    const verticalCompact = toRef(props, 'verticalCompact')
    const responsiveLayouts = toRef(props, 'responsiveLayouts')
    const autoSize = toRef(props, 'autoSize')
    const rowHeight = toRef(props, 'rowHeight')
    const margin = toRef(props, 'margin')
    const preventCollision = toRef(props, 'preventCollision')
    const responsive = toRef(props, 'responsive')
    const breakpoints = toRef(props, 'breakpoints')
    const cols = toRef(props, 'cols')
    const colNum = toRef(props, 'colNum')
    const isDraggable = toRef(props, 'isDraggable')
    const isResizable = toRef(props, 'isResizable')
    const maxRows = toRef(props, 'maxRows')
    const isMirrored = toRef(props, 'isMirrored')

    const emitter = mitt()
    const LayoutRef = ref()

    const state = reactive<State>({
      erd: null,
      width: null,
      mergedStyle: {
        height: '',
      },
      lastLayoutLength: 0,
      isDragging: false,
      placeholder: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        i: -1,
      },
      layouts: {}, // array to store all layouts from different breakpoints
      lastBreakpoint: null, // store last active breakpoint
      originalLayout: undefined, // store original Layout
    })

    provide('layout', {
      isResizable: isResizable.value,
      isMirrored: isMirrored.value,
      ...state,
    })

    // find difference in layouts
    function findDifference(layout: Layout, originalLayout: Layout): Layout {
      //Find values that are in result1 but not in result2
      let uniqueResultOne = layout.filter((obj) => !originalLayout.some((obj2) => obj.i === obj2.i))

      //Find values that are in result2 but not in result1
      let uniqueResultTwo = originalLayout.filter((obj) => !layout.some((obj2) => obj.i === obj2.i))

      //Combine the two arrays of unique entries#
      return uniqueResultOne.concat(uniqueResultTwo)
    }

    // clear all responsive layouts
    function initResponsiveFeatures() {
      // clear layouts
      state.layouts = Object.assign({}, responsiveLayouts.value)
    }

    function calcContainerHeight() {
      if (!autoSize.value) return

      const H = bottom(layout.value) * (rowHeight.value + margin.value[1]) + margin.value[1] + 'px'
      return H
    }

    function updateHeight() {
      state.mergedStyle = {
        height: calcContainerHeight()!,
      }
    }

    function layoutUpdate() {
      if (layout.value !== undefined && state.originalLayout !== null) {
        if (layout.value.length !== state.originalLayout?.length) {
          let diff = findDifference(layout.value, state.originalLayout!)
          if (diff.length > 0) {
            if (layout.value.length > (state.originalLayout as Layout).length) {
              state.originalLayout = [...state.originalLayout!, ...diff]
            } else {
              state.originalLayout = state.originalLayout?.filter(
                (obj) => !diff.some((obj2) => obj.i === obj2.i)
              )
            }
          }

          state.lastLayoutLength = layout.value.length
          initResponsiveFeatures()
        }

        compact(layout.value, verticalCompact.value)
        emitter.emit('updateWidth', { width: state.width })
        updateHeight()

        emit('layout-updated', layout.value)
      }
    }

    function onWindowResize() {
      if (LayoutRef.value) {
        state.width = LayoutRef.value.offsetWidth
      }
      emitter.emit('resizeEvent')
    }

    function dragEvent(eventName, i, x, y, h, w) {
      let l = getLayoutItem(layout.value, i)
      if (!l) {
        l = { x: 0, y: 0, w, h, i }
      }

      if (eventName === 'dragmove' || eventName === 'dragstart') {
        state.placeholder.i = i
        state.placeholder.x = l.x!
        state.placeholder.y = l.y!
        state.placeholder.w = w
        state.placeholder.h = h
        nextTick(() => {
          state.isDragging = true
        })
        emitter.emit('updateWidth', state.width)
      } else {
        nextTick(() => {
          state.isDragging = false
        })
      }

      layout.value = moveElement(layout.value, l, x, y, true, preventCollision.value)
      compact(layout.value, verticalCompact.value)
      emitter.emit('compact')
      updateHeight()
      if (eventName === 'dragend') {
        emit('layout-updated', layout.value)
      }
    }

    // finds or generates new layouts for set breakpoints
    function responsiveGridLayout() {
      let newBreakpoint = getBreakpointFromWidth(breakpoints.value, state.width)
      let newCols = getColsFromBreakpoint(newBreakpoint, cols.value)

      // save actual layout in layouts
      if (state.lastBreakpoint !== null && !state.layouts[state.lastBreakpoint])
        state.layouts[state.lastBreakpoint] = cloneLayout(layout.value)

      // Find or generate a new layout.
      let LAYOUT = findOrGenerateResponsiveLayout(
        state.originalLayout!,
        state.layouts,
        breakpoints.value,
        newBreakpoint,
        newCols,
        verticalCompact.value
      )

      // Store the new layout.
      state.layouts[newBreakpoint] = LAYOUT

      if (state.lastBreakpoint !== newBreakpoint) {
        emit('breakpoint-changed', newBreakpoint, LAYOUT)
      }

      // new prop sync
      emit('update:layout', LAYOUT)

      state.lastBreakpoint = newBreakpoint
      emitter.emit('setColNum', getColsFromBreakpoint(newBreakpoint, cols.value))
    }

    function resizeEvent(eventName, id, x, y, h, w) {
      let l = getLayoutItem(layout.value, id) as unknown as { h: number; w: number } | LayoutItem
      if (!l) {
        l = { h: 0, w: 0 }
      }

      let hasCollisions
      if (preventCollision.value) {
        const collisions = getAllCollisions(layout.value, { ...l, w, h }).filter(
          // TODO 怎么判断 i
          (layoutItem) => layoutItem.i !== (l as unknown as any).i
        )
        hasCollisions = collisions.length > 0

        // If we're colliding, we need adjust the placeholder.
        if (hasCollisions) {
          // adjust w && h to maximum allowed space
          let leastX = Infinity,
            leastY = Infinity
          collisions.forEach((layoutItem) => {
            if (layoutItem.x! > (l as LayoutItem).x!) leastX = Math.min(leastX, layoutItem.x!)
            if (layoutItem.y! > (l as LayoutItem).y!) leastY = Math.min(leastY, layoutItem.y!)
          })

          if (Number.isFinite(leastX)) l.w = leastX - (l as LayoutItem).x!
          if (Number.isFinite(leastY)) l.h = leastY - (l as LayoutItem).y!
        }
      }

      if (!hasCollisions) {
        // Set new width and height.
        l.w = w
        l.h = h
      }

      if (eventName === 'resizestart' || eventName === 'resizemove') {
        state.placeholder.i = id
        state.placeholder.x = x
        state.placeholder.y = y
        state.placeholder.w = l.w!
        state.placeholder.h = l.h!
        nextTick(() => {
          state.isDragging = true
        })
        emitter.emit('updateWidth', state.width)
      } else {
        nextTick(function () {
          state.isDragging = false
        })
      }

      if (responsive.value) responsiveGridLayout()

      compact(layout.value, verticalCompact.value)
      emitter.emit('compact')
      updateHeight()

      if (eventName === 'resizeend') emit('layout-updated', layout.value)
    }

    function resizeEventHandler(eventType, i, x, y, h, w) {
      resizeEvent(eventType, i, x, y, h, w)
    }

    function dragEventHandler(eventType, i, x, y, h, w) {
      dragEvent(eventType, i, x, y, h, w)
    }

    emitter.on('resizeEvent', () => {
      resizeEventHandler
    })

    emitter.on('dragEvent', () => {
      dragEventHandler
    })

    emit('layout-created', layout.value)

    watch(
      () => state.width,
      (newVal, oldVal) => {
        nextTick(() => {
          emitter.emit('updateWidth', newVal)
          if (oldVal === null) {
            nextTick(() => {
              emit('layout-ready', layout.value)
            })
          }
          updateHeight()
        })
      }
    )

    watch(
      () => layout.value,
      () => {
        layoutUpdate()
      }
    )

    watch(
      () => colNum.value,
      (val) => {
        emitter.emit('setColNum', val)
      }
    )

    watch(
      () => rowHeight.value,
      (val) => {
        emitter.emit('setRowHeight', val)
      }
    )

    watch(
      () => isDraggable.value,
      (val) => {
        emitter.emit('setDraggable', val)
      }
    )

    watch(
      () => isResizable.value,
      (val) => {
        emitter.emit('setResizable', val)
      }
    )

    watch(
      () => responsive.value,
      (val) => {
        if (!val) {
          emit('update:layout', state.originalLayout)
          emitter.emit('setColNum', colNum.value)
        }
        onWindowResize()
      }
    )

    watch(
      () => maxRows.value,
      (val) => {
        emitter.emit('setMaxRows', val)
      }
    )

    watch(
      () => margin.value,
      () => {
        updateHeight()
      }
    )

    onMounted(() => {
      emit('layout-mounted', layout.value)
      nextTick(() => {
        validateLayout(layout.value)
        state.originalLayout = layout.value
        nextTick(() => {
          onWindowResize()
          initResponsiveFeatures()
          addWindowEventListener('resize', onWindowResize)
          compact(layout.value, verticalCompact.value)
          emit('layout-updated', layout.value)
          updateHeight()
          nextTick(() => {
            state.erd = elementResizeDetectorMaker({
              strategy: 'scroll',
              callOnAdd: false,
            })
            state.erd.listenTo(LayoutRef.value, () => {
              onWindowResize()
            })
          })
        })
      })
    })

    onBeforeUnmount(() => {
      emitter.off('resizeEvent', () => {
        resizeEventHandler
      })
      emitter.off('dragEvent', () => {
        dragEventHandler
      })
      removeWindowEventListener('resize', onWindowResize)
      if (state.erd) {
        state.erd.uninstall(LayoutRef.value)
      }
    })

    return {
      ...toRefs(state),
      LayoutRef,
      layoutUpdate,
      updateHeight,
      onWindowResize,
      calcContainerHeight,
      dragEvent,
      resizeEvent,
      responsiveGridLayout,
      initResponsiveFeatures,
      findDifference,
      resizeEventHandler,
      dragEventHandler,
    }
  },
})
</script>

<style scoped lang="scss">
.grid-layout {
  @apply w-full;

  position: relative;
  color: red;
  transition: height 200ms ease;
}
</style>
