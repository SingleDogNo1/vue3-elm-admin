import request from '@/utils/axios'
import { Login, GetUserInfo } from './types'

export function userLogin(params: Login) {
  return request.post({
    url: '/user/login',
    params,
  })
}

export function getUserInfoApi(token: GetUserInfo) {
  return request.get({
    loading: true,
    url: '/user/info',
    params: { token },
  })
}

export function userLogout() {
  return request.post({
    url: '/user/logout',
  })
}
