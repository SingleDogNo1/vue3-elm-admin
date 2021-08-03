import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import {
  createRouter,
  createWebHashHistory,
  useRouter as baseUseRouter,
  useRoute as baseUseRoute,
} from 'vue-router'
import Layout from '@/layout/index.vue'

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
          title: 'router.dashboard',
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
      title: 'router.nestedPages',
      icon: 'nested',
    },
    component: Layout,
    children: [
      {
        path: 'a',
        name: 'ExampleA',
        component: () => import('@/views/Example/1.vue'),
        meta: {
          title: 'router.nestedPageA',
          icon: 'el-icon-eleme',
        },
      },
      {
        path: 'b',
        name: 'ExampleB',
        component: () => import('@/views/Example/2.vue'),
        meta: {
          title: 'router.nestedPageB',
          icon: 'el-icon-eleme',
        },
      },
    ],
  },
  {
    path: '/icon',
    component: Layout,
    redirect: '/icon/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/Icons/index.vue'),
        name: 'Icons',
        meta: {
          icon: 'icon',
          title: 'router.icon',
          noCache: true,
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
