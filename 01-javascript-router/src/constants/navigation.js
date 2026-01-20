// ベースURL
// Web公開することを想定しサブパス定義
export const BASE_URL = '/javascript-router-app';

// ルート定義用（:id などのプレースホルダーを含む）
// React Routerの<Route path={...}>で使用
export const PATHS = {
  TOP: `${BASE_URL}/`,
};

// 遷移用（実際のパスを指定）
// navigate()や<Link to={...}>で使用
export const NAV_ITEMS = {
  TOP: `${BASE_URL}/`,
};
