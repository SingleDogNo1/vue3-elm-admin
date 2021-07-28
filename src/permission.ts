import { router } from './router'
import { store } from './store'
import { ElMessage } from 'element-plus'
import { getToken } from './utils/auth'

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to) => {
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      return { name: 'Dashboard' }
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        return true
      } else {
        try {
          const roles = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          accessRoutes.map((route) => {
            router.addRoute(route)
          })

          return { ...to, replace: true }
        } catch (error) {
          console.log('error :>> ', error)
          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          return { path: `/login?redirect=${to.path}` }
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      return true
    } else {
      return { path: `/login?redirect=${to.path}` }
    }
  }
})
