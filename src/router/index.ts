import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRouter as baseUseRouter, useRoute as baseUseRoute } from 'vue-router'
import Layout from '@/layout/index.vue'

import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        meta: {
          hidden: true,
        },
        component: () => import('@/views/Redirect/index.vue'),
      },
    ],
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Home/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      hidden: true,
    },
  },
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/example',
    name: 'Example',
    meta: {
      title: 'Error Pages',
      icon: '404',
    },
    component: Layout,
    children: [
      {
        path: 'a',
        name: 'Tab1',
        component: () => import('@/views/Example/1.vue'),
        meta: {
          title: 'Tab1',
          icon: 'basketball',
        },
      },
      {
        path: 'b',
        name: 'Tab2',
        component: () => import('@/views/Example/2.vue'),
        meta: {
          title: 'Tab2',
          icon: 'basketball',
        },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// config-router
export function setupRouter(app: App<Element>) {
  app.use(router)
}

export function useRouter() {
  return baseUseRouter()
}

export function useRoute() {
  return baseUseRoute()
}
