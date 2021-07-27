import { MockMethod } from 'vite-plugin-mock'
import { ResultEnum } from '@/utils/axios/types'

enum tokens {
  admin = 'admin-token',
  editor = 'editor-token',
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
  },
}

export default [
  {
    url: '/user/login',
    method: 'post',
    response: (config) => {
      const { username } = config.body
      const token = tokens[username]
      if (!token) {
        return {
          code: 60204,
          message: 'account or password error',
        }
      }
      return {
        code: ResultEnum['SUCCESS'],
        message: 'login success',
        data: token,
      }
    },
  },
  {
    url: '/user/info',
    method: 'get',
    response: (config) => {
      const { token } = config.query
      const info = users[token]
      if (!info) {
        return {
          code: 50008,
          message: 'error',
        }
      }

      return {
        code: ResultEnum['SUCCESS'],
        data: info,
        message: 'get user info success',
      }
    },
  },
  {
    url: '/user/logout',
    method: 'post',
    response: () => {
      return {
        code: ResultEnum['SUCCESS'],
        data: 'success',
      }
    },
  },
] as MockMethod[]
