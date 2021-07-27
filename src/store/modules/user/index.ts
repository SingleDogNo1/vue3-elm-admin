import { Module } from 'vuex'
import RootState from '@/store/types'
import UserState from './types'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { userLogin, getUserInfoApi, userLogout } from '@/api/user'

const userModule: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve) => {
        userLogin({ username, password }).then((data) => {
          commit('SET_TOKEN', data)
          setToken(data)
          resolve(data)
        })
      })
    },
    getInfo({ commit, state }) {
      return new Promise((resolve) => {
        getUserInfoApi(state.token).then((data) => {
          console.log('data :>> ', data)
          const { roles, name, avatar, introduction } = data

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        userLogout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          // @ts-ignore
          resolve()
        })
      })
    },
  },
}

export default userModule
