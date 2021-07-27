import { Module } from 'vuex'
import RootState from '@/store/types'
import PermissionState from './types'
import { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles) {
  const res: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permissionModule: Module<PermissionState, RootState> = {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
  },
  actions: {
    generateRoutes({ commit }, roles) {
      return new Promise((resolve) => {
        let routes
        if (roles.includes('admin')) {
          routes = asyncRoutes || []
        } else {
          routes = filterAsyncRoutes(asyncRoutes, roles)
        }
        commit('SET_ROUTES', routes)
        resolve(routes)
      })
    },
  },
}

export default permissionModule
