# ルーティング戦略

## ルーティング構成

### パス定義の二重管理

**場所**: `src/constants/navigation.js`

#### NAVIGATION_LIST（ルート定義用）

```javascript
export const NAVIGATION_LIST = {
  TOP: `${BASE_PATH}/`,
  DETAIL: `${BASE_PATH}/detail/:id`, // :id はパラメータプレースホルダー
  CREATE: `${BASE_PATH}/create`,
  EDIT: `${BASE_PATH}/edit/:id`, // :id はパラメータプレースホルダー
};
```

**用途**: React Routerの`<Route path={...}>`で使用

#### NAVIGATION_PATH（遷移用）

```javascript
export const NAVIGATION_PATH = {
  TOP: `${BASE_PATH}/`,
  DETAIL: `${BASE_PATH}/detail/`, // idを後から結合
  CREATE: `${BASE_PATH}/create`,
  EDIT: `${BASE_PATH}/edit/`, // idを後から結合
};
```

**用途**: `navigate()`や`<NavLink to={...}>`で使用

### なぜ二重管理するのか？

- **ルート定義**: `:id`というプレースホルダーが必要
- **実際の遷移**: 具体的なid値を結合して遷移（例: `/detail/1`）

## ルーティング実装

### Router定義

**場所**: `src/router/index.jsx`

```javascript
export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path={NAVIGATION_LIST.TOP} element={<TodoListPage />} />
        <Route path={NAVIGATION_LIST.DETAIL} element={<TodoDetailPage />} />
        <Route path={NAVIGATION_LIST.CREATE} element={<TodoCreatePage />} />
        <Route path={NAVIGATION_LIST.EDIT} element={<TodoEditPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

**重要ポイント**:

- `react-router`パッケージから`BrowserRouter`, `Routes`, `Route`をインポート
- `index`属性でトップページを指定
- 動的パラメータ`:id`を含むルート定義

### Routerのマウント

**場所**: `src/main.jsx`

```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoProvider>
      <Router />
    </TodoProvider>
  </React.StrictMode>,
);
```

**レイヤー構造**:

1. `React.StrictMode`: 開発時の警告表示
2. `TodoProvider`: グローバル状態の提供
3. `Router`: ルーティング機能

## ナビゲーション実装パターン

### パターン1: NavLinkによる静的リンク

**場所**: `src/components/atoms/NavigationLink/NavigationLink.jsx`

```javascript
export const NavigationLink = ({ title, linkPath }) => (
  <li className={styles.li}>
    <NavLink to={linkPath}>{title}</NavLink>
  </li>
);
```

**使用例**:

```javascript
<NavigationLink title={"Top"} linkPath={NAVIGATION_PATH.TOP} />
<NavigationLink title={"Create"} linkPath={NAVIGATION_PATH.CREATE} />
```

**特徴**:

- 宣言的なリンク
- 現在のページを自動でアクティブ表示（NavLinkの機能）
- ヘッダーナビゲーションに最適

### パターン2: useNavigateによるプログラマティック遷移

**使用箇所**: Template専用フックやOrganismsコンポーネント

#### 例1: フォーム送信後の遷移

```javascript
// src/components/templates/TodoCreateTemplate/useTopCreateTemplate.js
const navigate = useNavigate();

const handleCreateTodo = useCallback(
  (e) => {
    e.preventDefault();
    if (inputTitle !== '' && inputContent !== '') {
      addTodo(inputTitle, inputContent);
      navigate(NAVIGATION_PATH.TOP); // 作成後トップへ
    }
  },
  [addTodo, inputTitle, inputContent, navigate],
);
```

#### 例2: 動的パラメータ付き遷移

```javascript
// src/components/organisms/TodoList/TodoList.jsx
const navigate = useNavigate();

const handleMoveDetailPage = useCallback(
  (id) => navigate(`${NAVIGATION_PATH.DETAIL}${id}`),
  [navigate],
);

const handleMoveEditPage = useCallback(
  (id) => navigate(`${NAVIGATION_PATH.EDIT}${id}`),
  [navigate],
);
```

**特徴**:

- 条件付き遷移が可能
- データ送信後の遷移に最適
- idなどの動的パラメータを結合可能

### パターン3: useParamsによるパラメータ取得

**使用箇所**: 詳細・編集ページのTemplate

#### 例1: 詳細ページ

```javascript
// src/components/templates/TodoDetailTemplate/TodoDetailTemplate.jsx
const { id } = useParams();
const todo = originTodoList.find((todo) => String(todo.id) === id);
```

#### 例2: 編集ページ

```javascript
// src/components/templates/TodoEditTemplate/useTodoEditTemplate.js
const { id } = useParams();
const todo = useMemo(
  () => originTodoList.find((todo) => String(todo.id) === id),
  [id, originTodoList],
);
```

**注意点**:

- `useParams()`で取得する`id`は**文字列**
- Todo配列の`id`は**数値**
- 比較時は`String(todo.id) === id`で型を揃える

## ルーティングのベストプラクティス

### 1. パス定義の一元管理

✅ **良い例**:

```javascript
navigate(NAVIGATION_PATH.TOP);
```

❌ **悪い例**:

```javascript
navigate('/react-output-router-v2/'); // ハードコーディング
```

### 2. BASE_PATHの活用

```javascript
export const BASE_PATH = '/react-output-router-v2';
```

- デプロイ先に応じて一箇所変更するだけで全体に反映
- GitHub Pagesなどのサブパスデプロイに対応

### 3. 型変換の明示

```javascript
// URLパラメータは文字列なので明示的に変換
String(todo.id) === id; // ✅ 推奨
todo.id == id; // ❌ 暗黙的な型変換に依存
```

### 4. useMemoによる最適化

```javascript
const todo = useMemo(
  () => originTodoList.find((todo) => String(todo.id) === id),
  [id, originTodoList],
);
```

- 検索処理を依存配列が変わるまでキャッシュ
- 不要な再計算を防ぐ

### 5. useCallbackによる最適化

```javascript
const handleMoveDetailPage = useCallback(
  (id) => navigate(`${NAVIGATION_PATH.DETAIL}${id}`),
  [navigate],
);
```

- 関数の再生成を防ぐ
- 子コンポーネントの不要な再レンダリングを防ぐ

## ルーティング実装チェックリスト

- [ ] `constants/navigation.js`にパス定義を追加
- [ ] `NAVIGATION_LIST`（ルート定義用）と`NAVIGATION_PATH`（遷移用）の両方を定義
- [ ] `router/index.jsx`に`<Route>`を追加
- [ ] Pageコンポーネントを作成（Templateのラッパー）
- [ ] Templateコンポーネントを作成
- [ ] 動的パラメータが必要な場合は`useParams()`で取得
- [ ] 遷移が必要な場合は`useNavigate()`を使用
- [ ] 型変換が必要な場合は明示的に変換
- [ ] パフォーマンス最適化（`useMemo`, `useCallback`）を適用
