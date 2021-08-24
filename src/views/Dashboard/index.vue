<template>
  <div class="h-full flex">
    <div>
      <div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div class="layoutItem" v-for="item in layout" :key="item.i">
            <b>{{ item.i }}</b
            >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div>
    </div>
    <div id="content">
      <button @click="decreaseWidth">Decrease Width</button>
      <button @click="increaseWidth">Increase Width</button>
      <button @click="addItem">Add an item</button>
      <button @click="addItemDynamically">Add an item dynamically</button>
      <button @click="changeDirection">Change Direction</button>
      <input type="checkbox" v-model="draggable" /> Draggable
      <input type="checkbox" v-model="resizable" /> Resizable
      <input type="checkbox" v-model="mirrored" /> Mirrored
      <input type="checkbox" v-model="responsive" /> Responsive
      <input type="checkbox" v-model="preventCollision" /> Prevent Collision
      <div class="my-3">
        Row Height: <input type="number" v-model="rowHeight" /> Col nums:
        <input type="number" v-model="colNum" /> Margin x:
        <input type="number" v-model="marginX" /> Margin y:
        <input type="number" v-model="marginY" />
      </div>

      <grid-layout
        :margin="[parseInt(marginX), parseInt(marginY)]"
        :layout="layout"
        :col-num="parseInt(colNum)"
        :row-height="rowHeight"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :is-mirrored="mirrored"
        :prevent-collision="preventCollision"
        :vertical-compact="compact"
        :use-css-transforms="true"
        :responsive="responsive"
        @layout-created="layoutCreatedEvent"
        @layout-mounted="layoutMountedEvent"
        @layout-ready="layoutReadyEvent"
        @layout-updated="layoutUpdatedEvent"
        @breakpoint-changed="breakpointChangedEvent"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :id="'item-' + item.i"
          :min-w="item.minW"
          :max-w="item.maxW"
          :min-x="item.minX"
          :max-x="item.maxX"
          :min-y="item.minY"
          :max-y="item.maxY"
          :preserve-aspect-ratio="item.preserveAspectRatio"
          @resize="resize"
          @move="move"
          @resized="resized"
          @container-resized="containerResized"
          @moved="moved"
        >
          <span>{{ item.i }}</span>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { GridLayout, GridItem } from '@/components/GridLayout'
import { getDocumentDir, setDocumentDir } from '@/components/GridLayout/helpers/DOM'

let testLayout = [
  {
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    i: '0',
    resizable: true,
    draggable: true,
    static: false,
    minY: 0,
    maxY: 2,
  },
  { x: 2, y: 0, w: 2, h: 4, i: '1', resizable: null, draggable: null, static: true },
  {
    x: 4,
    y: 0,
    w: 2,
    h: 5,
    i: '2',
    resizable: false,
    draggable: false,
    static: false,
    minX: 4,
    maxX: 4,
    minW: 2,
    maxW: 2,
    preserveAspectRatio: true,
  },
  { x: 6, y: 0, w: 2, h: 3, i: '3', resizable: false, draggable: false, static: false },
  { x: 8, y: 0, w: 2, h: 3, i: '4', resizable: false, draggable: false, static: false },
  { x: 10, y: 0, w: 2, h: 3, i: '5', resizable: false, draggable: false, static: false },
  { x: 0, y: 5, w: 2, h: 5, i: '6', resizable: false, draggable: false, static: false },
  { x: 2, y: 5, w: 2, h: 5, i: '7', resizable: false, draggable: false, static: false },
  { x: 4, y: 5, w: 2, h: 5, i: '8', resizable: false, draggable: false, static: false },
  { x: 6, y: 3, w: 2, h: 4, i: '9', resizable: false, draggable: false, static: true },
  { x: 8, y: 4, w: 2, h: 4, i: '10', resizable: false, draggable: false, static: false },
  { x: 10, y: 4, w: 2, h: 4, i: '11', resizable: false, draggable: false, static: false, minY: 4 },
  { x: 0, y: 10, w: 2, h: 5, i: '12', resizable: false, draggable: false, static: false },
  { x: 2, y: 10, w: 2, h: 5, i: '13', resizable: false, draggable: false, static: false },
  { x: 4, y: 8, w: 2, h: 4, i: '14', resizable: false, draggable: false, static: false },
  { x: 6, y: 8, w: 2, h: 4, i: '15', resizable: false, draggable: false, static: false },
  { x: 8, y: 10, w: 2, h: 5, i: '16', resizable: false, draggable: false, static: false },
  { x: 10, y: 4, w: 2, h: 2, i: '17', resizable: false, draggable: false, static: false },
  { x: 0, y: 9, w: 2, h: 3, i: '18', resizable: false, draggable: false, static: false },
  { x: 2, y: 6, w: 2, h: 2, i: '19', resizable: false, draggable: false, static: false },
]

export default defineComponent({
  name: 'Home',
  components: {
    GridLayout,
    GridItem,
  },
  setup() {
    const state = reactive({
      layout: JSON.parse(JSON.stringify(testLayout)),
      draggable: true,
      resizable: true,
      mirrored: false,
      responsive: true,
      preventCollision: true,
      compact: true,
      rowHeight: 30,
      colNum: 12,
      index: 0,
      marginX: 10,
      marginY: 10,
    })

    function increaseWidth() {
      let width = document.getElementById('content')?.offsetWidth as number
      width += 20
      document.getElementById('content')?.setAttribute('style', 'width:' + width + 'px')
    }

    function decreaseWidth() {
      let width = document.getElementById('content')?.offsetWidth as number
      width -= 20
      document.getElementById('content')?.setAttribute('style', 'width:' + width + 'px')
    }

    function removeItem(i) {
      console.log('### REMOVE ' + i)
      const index = state.layout.map((item) => item.i).indexOf(i)
      state.layout.splice(index, 1)
    }

    function addItem() {
      let item = { x: 0, y: 0, w: 2, h: 2, i: state.index + '', whatever: 'bbb' }
      state.index++
      state.layout.push(item)
    }

    function addItemDynamically() {
      const x = (state.layout.length * 2) % (state.colNum || 12)
      const y = state.layout.length + (state.colNum || 12)
      console.log('X=' + x + ' Y=' + y)
      let item = {
        x: x,
        y: y,
        w: 2,
        h: 2,
        i: state.index + '',
      }
      state.index++
      state.layout.push(item)
    }

    function move(i, newX, newY) {
      console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY)
    }
    function resize(i, newH, newW, newHPx, newWPx) {
      console.log(
        'RESIZE i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx
      )
    }

    function moved(i, newX, newY) {
      console.log('### MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
    }

    function resized(i, newH, newW, newHPx, newWPx) {
      console.log(
        '### RESIZED i=' +
          i +
          ', H=' +
          newH +
          ', W=' +
          newW +
          ', H(px)=' +
          newHPx +
          ', W(px)=' +
          newWPx
      )
    }
    function containerResized(i, newH, newW, newHPx, newWPx) {
      console.log(
        '### CONTAINER RESIZED i=' +
          i +
          ', H=' +
          newH +
          ', W=' +
          newW +
          ', H(px)=' +
          newHPx +
          ', W(px)=' +
          newWPx
      )
    }

    /**
     * Add change direction button
     */
    function changeDirection() {
      let documentDirection = getDocumentDir()
      const toggle = documentDirection === 'rtl' ? 'ltr' : 'rtl'
      setDocumentDir(toggle)
    }

    function layoutCreatedEvent(newLayout) {
      console.log('Created layout: ', newLayout)
    }

    function layoutMountedEvent(newLayout) {
      console.log('Mounted layout: ', newLayout)
    }

    function layoutReadyEvent(newLayout) {
      console.log('Ready layout: ', newLayout)
    }

    function layoutUpdatedEvent(newLayout) {
      console.log('Updated layout: ', newLayout)
    }
    function breakpointChangedEvent(newBreakpoint, newLayout) {
      console.log('breakpoint changed breakpoint=', newBreakpoint, ', layout: ', newLayout)
    }

    onMounted(() => {
      state.index = state.layout.length
    })

    return {
      ...toRefs(state),
      increaseWidth,
      decreaseWidth,
      removeItem,
      addItem,
      addItemDynamically,
      move,
      resize,
      moved,
      resized,
      containerResized,
      changeDirection,
      layoutCreatedEvent,
      layoutMountedEvent,
      layoutReadyEvent,
      layoutUpdatedEvent,
      breakpointChangedEvent,
    }
  },
})
</script>
