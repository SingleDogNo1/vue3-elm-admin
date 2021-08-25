export type TargetMove = {
  eventType: string
  i: number | string
  x: number
  y: number
  h: number
  w: number
}

export type MittEvents = {
  resizeEvent: TargetMove | void
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
