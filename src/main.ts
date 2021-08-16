import './styles/index.scss'
import './permission'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router'
import { setupStore } from './store'
import { setupGlobPlugins } from './plugins'
import { setupI18n } from './locales'
import { setupIconComponent } from '@/components/SvgIcon'
import { setupPermission } from './permission'

const app = createApp(App)

async function bootstrap() {
  // plugins
  await setupGlobPlugins(app)
  // vuex
  await setupStore(app)
  // vue-i18n
  await setupI18n(app)
  // vue-router
  await setupRouter(app)
  // 注册全局 svg-icon 组件
  await setupIconComponent(app)
  // 注册权限
  const { t } = await app.config.globalProperties.$i18n.global
  await setupPermission(router, t)
  // 所有组件注册完成
  await router.isReady()
  app.mount('#app')
}

void bootstrap()
