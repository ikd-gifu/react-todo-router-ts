// React Router v7を利用しているが、<BrowserRouter> + <Routes> パターン（宣言的ルーティング）で実装
// バックエンド連携のタイミングで createBrowserRouter に移行？
import { BrowserRouter, Routes, Route } from 'react-router';
import { PATHS } from '../constants/navigation.js';
import { TodoPage } from '../pages';

/**
 * アプリケーション全体のルーティング設定
 * Router コンポーネントの責務は「ルーティング設定」のみ
 */
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.TOP} element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
