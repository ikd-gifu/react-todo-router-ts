// React Router v7を利用しているが、<BrowserRouter> + <Routes> パターン（宣言的ルーティング）で実装
// バックエンド連携のタイミングで createBrowserRouter に移行？
import { BrowserRouter, Routes, Route } from 'react-router';
import { PATHS } from '../constants/navigation.js';
import { TodoPage, TodoDetailPage, TodoCreatePage, TodoEditPage } from '../pages';

/**
 * アプリケーション全体のルーティング設定
 */
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* index属性でトップページを指定 */}
        <Route index path={PATHS.TOP} element={<TodoPage />} />
        <Route path={PATHS.DETAIL} element={<TodoDetailPage />} />
        <Route path={PATHS.CREATE} element={<TodoCreatePage />} />
        <Route path={PATHS.EDIT} element={<TodoEditPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
