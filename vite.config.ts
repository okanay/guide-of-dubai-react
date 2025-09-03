import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production', override: true })
} else {
  dotenv.config({ path: '.env', override: true })
}

export default defineConfig({
  logLevel: 'silent',
  base: '/',
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      customViteReactPlugin: true,
      target: process.env.VITE_APP_BUILD_TARGET,
      pages: [],
    }),
    viteReact({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
})
