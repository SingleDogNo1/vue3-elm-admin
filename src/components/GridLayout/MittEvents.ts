type TargetMove = {
  eventType: string
  i: number | string
  x: number
  y: number
  h: number
  w: number
}

type MittEvents = {
  resizeEvent: TargetMove
  dragEvent: TargetMove
  updateWidth: {
    width: number
  }
  compact: void
  setColNum: number
  setRowHeight: number
  setDraggable: boolean
  setResizable: boolean
  setMaxRows: number
}
export default MittEvents
