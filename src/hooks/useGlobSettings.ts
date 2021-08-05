import { GlobEnvConfig } from '#/config'

interface Glob {
  title: string
  apiUrl: string
  urlPrefix: string | undefined
  uploadUrl: string | undefined
}

export const useGlobSetting = (): Glob => {
  const ENV = import.meta.env as unknown as GlobEnvConfig

  const glob = {
    title: ENV.VITE_GLOB_APP_TITLE,
    apiUrl: ENV.VITE_GLOB_API_URL,
    urlPrefix: ENV.VITE_GLOB_API_URL_PREFIX,
    uploadUrl: ENV.VITE_GLOB_UPLOAD_URL,
  }

  return glob
}
