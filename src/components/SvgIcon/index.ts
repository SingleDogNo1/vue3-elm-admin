import { App } from 'vue'
import SvgIcon from './index.vue'

export function setupIconComponent(app: App<Element>) {
  app.component('SvgIcon', SvgIcon)
}
