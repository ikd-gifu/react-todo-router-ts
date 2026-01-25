02-typescript-migration/vite.config.tsimport { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE_URL } from './src/constants/navigation'

// https://vite.dev/config/
// 競合を避けるためにポート番号を5174に変更
export default defineConfig({
  plugins: [react()],
  base: BASE_URL, // navigation.tsと一元管理 起動時のベースパス設定
  server: {
    port: 5174
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})
