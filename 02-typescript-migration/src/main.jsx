import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // React 18 以降の新しいレンダリング方法
import Router from './router/Router.jsx'
import { TodoProvider } from './contexts/TodoContext'
import './index.css'

// main.jsxはアプリケーションのエントリーポイントとして機能
// 複数の関心事を組み立て、アプリ起動・統合の責務を持つ
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* すべてのルート（ページ）で状態を共有するためにTodoProviderでラップ */}
    {/* ページ遷移してもデータが保持される */}
    <TodoProvider>
      <Router />
    </TodoProvider>
  </StrictMode>,
)
