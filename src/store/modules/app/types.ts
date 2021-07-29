export interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
}

export enum SidebarStateEnum {
  close = '0',
  open = '1',
}
