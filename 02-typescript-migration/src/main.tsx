import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // React 18 以降の新しいレンダリング方法
import Router from './router/Router'
import { TodoProvider } from './contexts/TodoContext'
import './index.css'

// main.jsxはアプリケーションのエントリーポイントとして機能
// 複数の関心事を組み立て、アプリ起動・統合の責務を持つ
// index.htmlでrootの存在が前提となっている
// https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* すべてのルート（ページ）で状態を共有するためにTodoProviderでラップ */}
    {/* ページ遷移してもデータが保持される */}
    <TodoProvider>
      <Router />
    </TodoProvider>
  </StrictMode>,
)
