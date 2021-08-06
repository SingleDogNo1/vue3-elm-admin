// import { router } from './router'
import { store } from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from './utils/auth'
import setPageTitle from '@/utils/setPageTitle'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

function createPermission(router, t) {
  router.beforeEach(async (to) => {
    NProgress.start()
    document.title = setPageTitle(to.meta.title as string, t)
    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        NProgress.done()
        return { name: 'Dashboard' }
      } else {
        const hasRoles = store.getters.roles && store.getters.roles.length > 0

        if (hasRoles) {
          NProgress.done()
          return true
        } else {
          try {
            const roles = await store.dispatch('user/getInfo')
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            accessRoutes.map((route) => {
              router.addRoute(route)
            })
            NProgress.done()
            return { ...to, replace: true }
          } catch (error) {
            console.log('error :>> ', error)
            await store.dispatch('user/resetToken')
            ElMessage.error(error || 'Has Error')
            NProgress.done()
            return { path: `/login?redirect=${to.path}` }
          }
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        NProgress.done()
        return true
      } else {
        NProgress.done()
        return { path: `/login?redirect=${to.path}` }
      }
    }
  })
}

export function setupPermission(router, t) {
  createPermission(router, t)
}
