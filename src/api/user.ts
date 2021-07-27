import request from '@/utils/axios'

export function userLogin(params) {
  return request.post({
    url: '/user/login',
    params,
  })
}

export function getUserInfoApi(token) {
  return request.get({
    url: '/user/info',
    params: { token },
  })
}

export function userLogout() {
  return request.post({
    url: '/user/logout',
  })
}
