import { UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import viteSvgIcons from 'vite-plugin-svg-icons'
import html from 'vite-plugin-html'

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: false,
      }),
      viteSvgIcons({
        iconDirs: [resolve(process.cwd(), 'src/components/SvgIcon/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      html({
        inject: {
          injectData: {
            title: env.VITE_GLOB_APP_TITLE,
          },
        },
        minify: true,
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: resolve(__dirname, 'src') + '/',
        },
        {
          find: /^\/#\//,
          replacement: resolve(__dirname, 'types') + '/',
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: scssData,
          sourceMap: true,
          additionalData: `@import "./src/styles/entry.scss";`,
        },
      },
    },
  }
}
