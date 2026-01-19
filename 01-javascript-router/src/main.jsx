import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // React 18 以降の新しいレンダリング方法
import { TodoPage } from "./pages";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoPage />
  </StrictMode>,
)
