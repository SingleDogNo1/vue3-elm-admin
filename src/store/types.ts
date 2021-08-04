import UserState from './modules/user/types'
import LocaleModule from './modules/locale/types'
import PermissionState from './modules/permission/types'
import { AppState } from './modules/app/types'
import TagsViewState from './modules/tagsView/types'
import SettingsState from './modules/settings/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RootState {}

export interface AllState extends RootState {
  user: UserState
}
export interface AllState extends RootState {
  locale: LocaleModule
}

export interface AllState extends RootState {
  permission: PermissionState
}

export interface AllState extends RootState {
  app: AppState
}

export interface AllState extends RootState {
  tagsView: TagsViewState
}

export interface AllState extends RootState {
  settings: SettingsState
}
