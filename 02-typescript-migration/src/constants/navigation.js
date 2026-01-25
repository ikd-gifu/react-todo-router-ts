// ベースURL
// Web公開することを想定しサブパス定義
export const BASE_URL = '/javascript-router-app';

// ルート定義用（:id などのプレースホルダーを含む）
// React Routerの<Route path={...}>で使用
export const PATHS = {
  TOP: `${BASE_URL}/`,
  DETAIL: `${BASE_URL}/detail/:id`, // :id は動的パラメータ
  CREATE: `${BASE_URL}/create`,
  EDIT: `${BASE_URL}/edit/:id`,
};

// 遷移用（実際のパスを指定）
// navigate()や<Link to={...}>で使用
export const NAV_ITEMS = {
  TOP: `${BASE_URL}/`,
  DETAIL: `${BASE_URL}/detail/`, // 実際の遷移時は detail/1 のように結合
  CREATE: `${BASE_URL}/create`,
  EDIT: `${BASE_URL}/edit/`, // 実際の遷移時は edit/1 のように結合
};
