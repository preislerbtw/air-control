import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'

export default defineConfig({
  main: {},
  renderer: {
    plugins: [react()],
    css: { postcss: { plugins: [tailwindcss({ config: resolve('tailwind.config.js') }), autoprefixer()] } }
  }
})
