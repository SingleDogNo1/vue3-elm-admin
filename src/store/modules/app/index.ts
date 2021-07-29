import { Module } from 'vuex'
import RootState from '@/store/types'
import { AppState, SidebarStateEnum } from './types'

const AppModule: Module<AppState, RootState> = {
  namespaced: true,
  state: {
    sidebar: {
      opened: localStorage.getItem('sidebarStatus')
        ? Boolean(localStorage.getItem('sidebarStatus'))
        : true,
      withoutAnimation: false,
    },
  },
  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        localStorage.setItem('sidebarStatus', SidebarStateEnum['open'])
      } else {
        localStorage.setItem('sidebarStatus', SidebarStateEnum['close'])
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      localStorage.setItem('sidebarStatus', SidebarStateEnum['close'])
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
  },
}

export default AppModule
