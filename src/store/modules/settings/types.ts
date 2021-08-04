export default interface SettingsState {
  /** 系统色 */
  theme: string
  /** 是否显示设置面板 */
  showSettings: boolean
  /** 是否显示标签控件 */
  tagsView: boolean
  /** 导航栏和标签控件是否固定在顶部 */
  fixedHeader: boolean
}
