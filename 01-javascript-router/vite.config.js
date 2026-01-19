import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 競合を避けるためにポート番号を5174に変更
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})
