// eslintは.jsが標準なので設定ファイルも.jsにする
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020, // ES2022 のグローバル変数を許可
      globals: globals.browser, // `window`, `document` などを使用可能にする
    },
    rules: {
      // React Hooksの正しい使い方を強制（必須）
      ...reactHooks.configs.recommended.rules,
      
      // Viteの高速リフレッシュを最適化（開発体験向上）
      'react-refresh/only-export-components': [
        'warn', // エラーではなく警告
        { allowConstantExport: true }, // 定数のエクスポートは許可
      ],
    },
  },
)
