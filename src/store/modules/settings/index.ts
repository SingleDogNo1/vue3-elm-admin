import { Module } from 'vuex'
import RootState from '@/store/types'
import SettingsState from './types'
import { useGlobCss } from '@/hooks/useGlobCss'

const styles = useGlobCss()

const settingsModule: Module<SettingsState, RootState> = {
  namespaced: true,
  state: {
    theme: styles.themeColor,
    showSettings: true,
    tagsView: true,
    fixedHeader: false,
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value
      }
    },
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    },
  },
}

export default settingsModule
