import { InjectionKey, App } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { AllState } from './types'
// import createPersistedState from 'vuex-persistedstate'
import getters from './getters'
import user from './modules/user'
import locale from './modules/locale'
import permission from './modules/permission'

export const store = createStore<AllState>({
  plugins: [
    // createPersistedState({
    //   storage: window.sessionStorage,
    // }),
  ],
  getters,
  modules: {
    user,
    locale,
    permission,
  },
})

export const key: InjectionKey<Store<AllState>> = Symbol('vue-store')

export function useStore<T = AllState>(): Store<T> {
  return baseUseStore<T>(key)
}

// config-store
export function setupStore(app: App<Element>) {
  app.use(store, key)
}
