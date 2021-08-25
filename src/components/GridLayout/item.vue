<template>
  <div ref="gridItemRef" class="grid-item grid-placeholder" :class="classObj" :style="style">
    <slot></slot>
    <span v-if="resizableAndNotStatic" ref="handle" :class="resizableHandleClass"></span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  toRef,
  ref,
  inject,
  computed,
  nextTick,
  onBeforeUnmount,
  watch,
} from 'vue'
import { Emitter } from 'mitt'
import type { Position } from './helpers/utils'
import { setTopLeft, setTopRight, setTransformRtl, setTransform } from './helpers/utils'
import { getControlPosition, createCoreData } from './helpers/draggableUtils'
import { getColsFromBreakpoint } from './helpers/responsiveUtils'
import { getDocumentDir } from './helpers/DOM'
import MittEvents from './MittEvents'
import interact from 'interactjs'

export default defineComponent({
  name: 'GridItem',
  props: {
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isResizable: {
      type: Boolean,
      default: false,
    },
    static: {
      type: Boolean,
      default: false,
    },
    minH: {
      type: Number,
      default: 1,
    },
    minW: {
      type: Number,
      default: 1,
    },
    maxH: {
      type: Number,
      default: Infinity,
    },
    maxW: {
      type: Number,
      default: Infinity,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    w: {
      type: Number,
      required: true,
    },
    h: {
      type: Number,
      required: true,
    },
    i: {
      type: [Number, String],
      required: true,
    },
    dragIgnoreFrom: {
      type: String,
      default: 'a, button',
    },
    dragAllowFrom: {
      type: String,
      default: '',
    },
    resizeIgnoreFrom: {
      type: String,
      default: 'a, button',
    },
    preserveAspectRatio: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['container-resized', 'resize', 'resized', 'move', 'moved'],
  setup(props, { emit }) {
    const isDraggable = toRef(props, 'isDraggable')
    const isResizable = toRef(props, 'isResizable')
    const x = toRef(props, 'x')
    const y = toRef(props, 'y')
    const h = toRef(props, 'h')
    const w = toRef(props, 'w')
    const i = toRef(props, 'i')
    const fixed = toRef(props, 'static')
    const minW = toRef(props, 'minW')
    const maxW = toRef(props, 'maxW')
    const minH = toRef(props, 'minH')
    const maxH = toRef(props, 'maxH')
    const dragIgnoreFrom = toRef(props, 'dragIgnoreFrom')
    const dragAllowFrom = toRef(props, 'dragAllowFrom')
    const resizeIgnoreFrom = toRef(props, 'resizeIgnoreFrom')
    const preserveAspectRatio = toRef(props, 'preserveAspectRatio')

    const layout: { [key: string]: any } = inject('layout')!
    const emitter: Emitter<MittEvents> = inject('emitter')!
    const gridItemRef = ref()

    const state = reactive({
      interactObj: null as any,
      cols: 1,
      containerWidth: 100,
      rowHeight: 30,
      margin: [10, 10],
      maxRows: Infinity,
      draggable: null as any,
      resizable: null as any,
      useCssTransforms: true,
      useStyleCursor: true,
      isDragging: false,
      isResizing: false,
      dragging: null as null | { top: number; left: number },
      resizing: null as null | { width: number; height: number },
      lastX: NaN,
      lastY: NaN,
      lastW: NaN,
      lastH: NaN,
      style: {},
      rtl: false,
      dragEventSet: false,
      resizeEventSet: false,
      previousW: null as null | number,
      previousH: null as null | number,
      previousX: null as null | number,
      previousY: null as null | number,
      innerX: x.value,
      innerY: y.value,
      innerW: w.value,
      innerH: h.value,
    })

    const resizableAndNotStatic = computed(() => state.resizable && !fixed.value)
    const renderRtl = computed(() => (layout.isMirrored ? !state.rtl : state.rtl))
    const isAndroid = computed(() => navigator.userAgent.toLowerCase().includes('android'))
    const draggableOrResizableAndNotStatic = computed(
      () => (state.draggable || state.resizable) && !fixed.value
    )
    const classObj = computed(() => {
      return {
        'vue-resizable': resizableAndNotStatic.value,
        static: fixed.value,
        resizing: state.isResizing,
        'draggable-dragging': state.isDragging,
        cssTransforms: state.useCssTransforms,
        'render-rtl': renderRtl.value,
        'disable-user-select': state.isDragging,
        'no-touch': isAndroid.value && draggableOrResizableAndNotStatic.value,
      }
    })
    const resizableHandleClass = computed(() => {
      if (renderRtl.value) {
        return 'resizable-handle rtl-resizable-handle'
      } else {
        return 'resizable-handle'
      }
    })

    function calcColWidth() {
      const colWidth = (state.containerWidth - state.margin[0] * (state.cols + 1)) / state.cols
      console.log('colWidth :>> ', state.containerWidth)
      return colWidth
    }

    function calcPosition(x, y, w, h) {
      const colWidth = calcColWidth()
      console.log('colWidth :>> ', colWidth)
      let pos: Position
      if (renderRtl.value) {
        pos = {
          right: Math.round(colWidth * x + (x + 1) * state.margin[0]),
          top: Math.round(state.rowHeight * y + (y + 1) * state.margin[1]),
          width:
            w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * state.margin[0]),
          height:
            h === Infinity
              ? h
              : Math.round(state.rowHeight * h + Math.max(0, h - 1) * state.margin[1]),
        }
      } else {
        pos = {
          left: Math.round(colWidth * x + (x + 1) * state.margin[0]),
          top: Math.round(state.rowHeight * y + (y + 1) * state.margin[1]),
          width:
            w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * state.margin[0]),
          height:
            h === Infinity
              ? h
              : Math.round(state.rowHeight * h + Math.max(0, h - 1) * state.margin[1]),
        }
      }
      return pos
    }

    function createStyle() {
      if (w.value + x.value > state.cols) {
        state.innerX = 0
        state.innerW = w.value > state.cols ? state.cols : w.value
      } else {
        state.innerX = x.value
        state.innerW = w.value
      }
      console.log(
        'state.innerX, state.innerY, state.innerW, state.innerH :>> ',
        state.innerX,
        state.innerY,
        state.innerW,
        state.innerH
      )
      let pos = calcPosition(state.innerX, state.innerY, state.innerW, state.innerH)

      if (state.isDragging) {
        pos.top = state.dragging?.top
        if (renderRtl.value) {
          pos.right = state.dragging?.left
        } else {
          pos.left = state.dragging?.left
        }
      }

      if (state.isResizing) {
        pos.width = state.resizing?.width as number
        pos.height = state.resizing?.height as number
      }

      let style
      if (state.useCssTransforms) {
        if (renderRtl.value) {
          style = setTransformRtl(pos.top, pos.right, pos.width, pos.height)
        } else {
          style = setTransform(pos.top, pos.left, pos.width, pos.height)
        }
      } else {
        if (renderRtl.value) {
          style = setTopRight(pos.top, pos.right, pos.width, pos.height)
        } else {
          style = setTopLeft(pos.top, pos.left, pos.width, pos.height)
        }
      }
      state.style = style
    }

    function emitContainerResized() {
      let styleProps: { width?: string; height?: string } = {}
      for (let prop of ['width', 'height']) {
        let val = state.style[prop]
        let matches = val.match(/^(\d+)px$/)
        if (!matches) return
        styleProps[prop] = matches[1]
      }
      emit('container-resized', i.value, h.value, w.value, styleProps.height, styleProps.width)
    }

    function calcWH(height, width, autoSizeFlag = false) {
      const colWidth = calcColWidth()

      let w = Math.round((width + state.margin[0]) / (colWidth + state.margin[0]))
      let h = 0
      if (!autoSizeFlag) {
        h = Math.round((height + state.margin[1]) / (state.rowHeight + state.margin[1]))
      } else {
        h = Math.ceil((height + state.margin[1]) / (state.rowHeight + state.margin[1]))
      }

      // Capping
      w = Math.max(Math.min(w, state.cols - state.innerX), 0)
      h = Math.max(Math.min(h, state.maxRows - state.innerY), 0)
      return { w, h }
    }

    function calcXY(top, left) {
      const colWidth = calcColWidth()
      let x = Math.round((left - state.margin[0]) / (colWidth + state.margin[0]))
      let y = Math.round((top - state.margin[1]) / (state.rowHeight + state.margin[1]))

      x = Math.max(Math.min(x, state.cols - state.innerW), 0)
      y = Math.max(Math.min(y, state.maxRows - state.innerH), 0)

      return { x, y }
    }

    function handleResize(event) {
      if (fixed.value) return
      const position = getControlPosition(event)
      if (!position) return
      const { x, y } = position

      const newSize = { width: 0, height: 0 }
      let pos
      switch (event.type) {
        case 'resizestart':
          state.previousW = state.innerW
          state.previousH = state.innerH
          pos = calcPosition(state.innerX, state.innerY, state.innerW, state.innerH)
          newSize.width = pos.width
          newSize.height = pos.height
          state.resizing = newSize
          state.isResizing = true
          break
        case 'resizemove':
          const coreEvent = createCoreData(state.lastW, state.lastH, x, y)
          if (renderRtl.value) {
            newSize.width = (state.resizing?.width as number) - coreEvent.deltaX
          } else {
            newSize.width = (state.resizing?.width as number) + coreEvent.deltaX
          }
          newSize.height = (state.resizing?.height as number) + coreEvent.deltaY
          state.resizing = newSize
          break
        case 'resizeend':
          pos = calcPosition(state.innerX, state.innerY, state.innerW, state.innerH)
          newSize.width = pos.width
          newSize.height = pos.height
          state.resizing = null
          state.isResizing = false
          break
      }

      pos = calcWH(newSize.height, newSize.width)
      if (pos.w < minW.value) {
        pos.w = minW.value
      }
      if (pos.w > maxW.value) {
        pos.w = maxW.value
      }
      if (pos.h < minH.value) {
        pos.h = minH.value
      }
      if (pos.h > maxH.value) {
        pos.h = maxH.value
      }

      if (pos.h < 1) {
        pos.h = 1
      }
      if (pos.w < 1) {
        pos.w = 1
      }

      state.lastW = x
      state.lastH = y

      if (state.innerW !== pos.w || state.innerH !== pos.h) {
        emit('resize', i.value, pos.h, pos.w, newSize.height, newSize.width)
      }
      if (
        event.type === 'resizeend' &&
        (state.previousW !== state.innerW || state.previousH !== state.innerH)
      ) {
        emit('resized', i.value, pos.h, pos.w, newSize.height, newSize.width)
      }
      emitter.emit('resizeEvent', {
        eventType: event.type,
        i: i.value,
        x: state.innerX,
        y: state.innerY,
        h: pos.h,
        w: pos.w,
      })
    }

    function handleDrag(event) {
      if (fixed.value) return
      if (state.isResizing) return

      const position = getControlPosition(event)
      if (!position) return
      const { x, y } = position
      let newPosition = { top: 0, left: 0 }
      switch (event.type) {
        case 'dragstart': {
          state.previousX = state.innerX
          state.previousY = state.innerY

          let parentRect = event.target.offsetParent.getBoundingClientRect()
          let clientRect = event.target.getBoundingClientRect()
          if (renderRtl.value) {
            newPosition.left = (clientRect.right - parentRect.right) * -1
          } else {
            newPosition.left = clientRect.left - parentRect.left
          }
          newPosition.top = clientRect.top - parentRect.top
          state.dragging = newPosition
          state.isDragging = true
          break
        }
        case 'dragend': {
          if (!state.isDragging) return
          let parentRect = event.target.offsetParent.getBoundingClientRect()
          let clientRect = event.target.getBoundingClientRect()
          if (renderRtl.value) {
            newPosition.left = (clientRect.right - parentRect.right) * -1
          } else {
            newPosition.left = clientRect.left - parentRect.left
          }
          newPosition.top = clientRect.top - parentRect.top
          state.dragging = null
          state.isDragging = false
          break
        }
        case 'dragmove': {
          const coreEvent = createCoreData(state.lastX, state.lastY, x, y)
          if (renderRtl.value) {
            newPosition.left = (state.dragging?.left as number) - coreEvent.deltaX
          } else {
            newPosition.left = (state.dragging?.left as number) + coreEvent.deltaX
          }
          newPosition.top = (state.dragging?.top as number) + coreEvent.deltaY
          state.dragging = newPosition
          break
        }
      }

      let pos
      if (renderRtl.value) {
        pos = calcXY(newPosition.top, newPosition.left)
      } else {
        pos = calcXY(newPosition.top, newPosition.left)
      }

      state.lastX = x
      state.lastY = y

      if (state.innerX !== pos.x || state.innerY !== pos.y) {
        emit('move', i.value, pos.x, pos.y)
      }
      if (
        event.type === 'dragend' &&
        (state.previousX !== state.innerX || state.previousY !== state.innerY)
      ) {
        emit('moved', i.value, pos.x, pos.y)
      }
      emitter.emit('dragEvent', {
        eventType: event.type,
        i: i.value,
        x: pos.x,
        y: pos.y,
        h: state.innerH,
        w: state.innerW,
      })
    }

    function updateWidth(width: number, colNum?: number) {
      state.containerWidth = width
      if (colNum) {
        state.cols = colNum
      }
    }

    function compact() {
      createStyle()
    }

    function tryMakeDraggable() {
      if (!state.interactObj) {
        state.interactObj = interact(gridItemRef.value)
        if (!state.useStyleCursor) {
          state.interactObj.styleCursor(false)
        }
      }
      if (state.draggable && !fixed.value) {
        const opts = {
          ignoreFrom: dragIgnoreFrom.value,
          allowFrom: dragAllowFrom.value,
        }
        state.interactObj.draggable(opts)
        if (!state.dragEventSet) {
          state.dragEventSet = true
          state.interactObj.on('dragstart dragmove dragend', (event) => {
            handleDrag(event)
          })
        }
      } else {
        state.interactObj.draggable({
          enabled: false,
        })
      }
    }

    function tryMakeResizable() {
      if (!state.interactObj) {
        state.interactObj = interact(gridItemRef.value)
        if (!state.useStyleCursor) {
          state.interactObj.styleCursor(false)
        }
      }
      if (state.resizable && !fixed.value) {
        let maximum = calcPosition(0, 0, maxW.value, maxH.value)
        let minimum = calcPosition(0, 0, minW.value, minH.value)

        const opts: any = {
          edges: {
            left: false,
            right: '.' + resizableHandleClass.value.trim().replace(' ', '.'),
            bottom: '.' + resizableHandleClass.value.trim().replace(' ', '.'),
            top: false,
          },
          ignoreFrom: resizeIgnoreFrom.value,
          restrictSize: {
            min: {
              height: minimum.height,
              width: minimum.width,
            },
            max: {
              height: maximum.height,
              width: maximum.width,
            },
          },
        }

        if (preserveAspectRatio.value) {
          opts.modifiers = [
            interact.modifiers.aspectRatio({
              ratio: 'preserve',
            }),
          ]
        }

        state.interactObj.resizable(opts)
        if (!state.resizeEventSet) {
          state.resizeEventSet = true
          state.interactObj.on('resizestart resizemove resizeend', (event) => {
            handleResize(event)
          })
        }
      } else {
        state.interactObj.resizable({
          enabled: false,
        })
      }
    }

    function updateWidthHandler(width) {
      updateWidth(width)
    }

    function compactHandler() {
      compact()
    }

    function setDraggableHandler(val) {
      if (isDraggable.value === false) {
        state.draggable = val
      }
    }

    function setResizableHandler(val) {
      if (isResizable.value === false) {
        state.resizable = val
      }
    }

    function setRowHeightHandler(rowHeight) {
      state.rowHeight = rowHeight
    }

    function setMaxRowsHandler(maxRows) {
      state.maxRows = maxRows
    }

    function setColNum(colNum) {
      state.cols = parseInt(colNum)
    }

    state.rtl = getDocumentDir() === 'rtl'

    watch(
      () => isDraggable.value,
      (value) => {
        state.draggable = value
      }
    )

    watch(
      () => fixed.value,
      () => {
        tryMakeDraggable()
        tryMakeResizable()
      }
    )

    watch(
      () => state.draggable,
      () => {
        tryMakeDraggable()
      }
    )

    watch(
      () => isResizable.value,
      (value) => {
        state.resizable = value
      }
    )

    watch(
      () => state.resizable,
      () => {
        tryMakeResizable()
      }
    )

    watch(
      () => state.rowHeight,
      () => {
        createStyle()
        emitContainerResized()
      }
    )

    watch(
      () => state.cols,
      () => {
        tryMakeResizable()
        createStyle()
        emitContainerResized()
      }
    )

    watch(
      () => state.containerWidth,
      () => {
        tryMakeResizable()
        createStyle()
        emitContainerResized()
      }
    )

    watch(
      () => x.value,
      (value) => {
        state.innerX = value
        createStyle()
      }
    )

    watch(
      () => y.value,
      (value) => {
        state.innerY = value
        createStyle()
      }
    )

    watch(
      () => h.value,
      (value) => {
        state.innerH = value
        createStyle()
      }
    )
    watch(
      () => w.value,
      (value) => {
        state.innerW = value
        createStyle()
      }
    )
    // watch([minH.value, maxH.value, minW.value, maxW.value], () => {
    //   tryMakeResizable
    // })
    watch(
      () => minH.value,
      () => {
        tryMakeResizable
      }
    )

    watch(
      () => renderRtl.value,
      () => {
        tryMakeResizable()
        createStyle()
      }
    )

    watch(
      () => layout.margin,
      (margin) => {
        if (!margin || (margin[0] == state.margin[0] && margin[1] == state.margin[1])) return

        state.margin = margin.map((m) => Number(m))
        createStyle()
        emitContainerResized()
      }
    )

    onMounted(() => {
      nextTick(() => {
        if (layout.responsive && layout.lastBreakpoint) {
          state.cols = getColsFromBreakpoint(layout.lastBreakpoint, layout.cols)
        } else {
          state.cols = layout.colNum
        }
        state.rowHeight = layout.rowHeight
        state.containerWidth = layout.width ?? 100
        state.margin = layout.margin ?? [10, 10]
        state.maxRows = layout.maxRows

        if (isDraggable.value === null) {
          state.draggable = layout.isDraggable
        } else {
          state.draggable = isDraggable.value
        }
        if (isResizable.value === null) {
          state.resizable = layout.isResizable
        } else {
          state.resizable = isResizable.value
        }
        state.useCssTransforms = layout.useCssTransforms
        state.useStyleCursor = layout.useStyleCursor
        createStyle()

        emitter.on('updateWidth', ({ width }) => {
          updateWidthHandler(width)
        })
        emitter.on('compact', () => {
          compactHandler()
        })
        emitter.on('setDraggable', (val) => {
          setDraggableHandler(val)
        })
        emitter.on('setResizable', (val) => {
          setResizableHandler(val)
        })
        emitter.on('setRowHeight', (val) => {
          setRowHeightHandler(val)
        })
        emitter.on('setMaxRows', (val) => {
          setMaxRowsHandler(val)
        })
        emitter.on('setColNum', (val) => {
          setColNum(val)
        })
      })
    })

    onBeforeUnmount(() => {
      emitter.off('updateWidth', updateWidthHandler)
      emitter.off('compact', compactHandler)
      emitter.off('setDraggable', setDraggableHandler)
      emitter.off('setResizable', setResizableHandler)
      emitter.off('setRowHeight', setRowHeightHandler)
      emitter.off('setMaxRows', setMaxRowsHandler)
      emitter.off('setColNum', setColNum)
      if (state.interactObj) {
        state.interactObj.unset()
      }
    })
    return {
      ...toRefs(state),
      layout,
      gridItemRef,
      resizableAndNotStatic,
      renderRtl,
      isAndroid,
      draggableOrResizableAndNotStatic,
      classObj,
      resizableHandleClass,
      createStyle,
      emitContainerResized,
      handleResize,
      handleDrag,
      calcPosition,
      calcXY,
      calcColWidth,
      calcWH,
      updateWidth,
      compact,
      tryMakeDraggable,
      tryMakeResizable,
      updateWidthHandler,
      compactHandler,
      setDraggableHandler,
      setResizableHandler,
      setRowHeightHandler,
      setMaxRowsHandler,
      setColNum,
    }
  },
})
</script>

<style scoped lang="scss">
.grid-item {
  transition: all 200ms ease;
  transition-property: left, top, right;

  &.no-touch {
    touch-action: none;
  }

  &.cssTransforms {
    right: auto;
    left: 0;
    transition-property: transform;

    &.render-rtl {
      right: 0;
      left: auto;
    }
  }

  &.resizing {
    z-index: 3;
    opacity: 0.6;
  }

  &.draggable-dragging {
    z-index: 3;
    transition: none;
  }

  &.grid-placeholder {
    z-index: 2;
    background: red;
    opacity: 0.2;
    transition-duration: 100ms;
    user-select: none;
  }

  > .resizable-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    padding: 0 3px 3px 0;
    cursor: se-resize;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
  }

  .rtl-resizable-handle {
    right: auto;
    bottom: 0;
    left: 0;
    padding-left: 3px;
    cursor: sw-resize;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);
    background-position: bottom left;
    background-repeat: no-repeat;
    background-origin: content-box;
  }

  &.disable-user-select {
    user-select: none;
  }
}
</style>
