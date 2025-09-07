import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import path from 'path'

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tailwindcss(),
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
    svgr(),
  ],
})
