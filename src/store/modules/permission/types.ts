import { RouteRecordRaw } from 'vue-router'

export default interface PermissionState {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
}
