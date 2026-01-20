# コンポーネント設計パターン

## Atomic Designの適用

### 階層構造の原則

```
Atoms (最小単位)
  ↓
Molecules (Atomsの組み合わせ)
  ↓
Organisms (Molecules + Atomsの組み合わせ)
  ↓
Templates (レイアウト + ビジネスロジック統合)
  ↓
Pages (Templateのラッパー)
```

## Atoms（基礎UI層）

### 設計原則

- **単一責任**: 1つの明確なUI機能のみを持つ
- **高い再利用性**: プロジェクト全体で使い回せる
- **ロジックレス**: 表示とpropsの受け渡しのみ
- **スタイル独立**: CSS Modulesで完全にスコープ化

### 実装パターン

#### InputForm

**場所**: `src/components/atoms/InputForm/InputForm.jsx`

```javascript
export const InputForm = ({ value, placeholder, onChange, disabled }) => (
  <input
    className={styles.input}
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    disabled={disabled}
  />
);
```

**特徴**:

- 制御されたコンポーネント（`value` + `onChange`）
- `disabled`でread-only対応
- 最小限のprops

#### CommonButton

**場所**: `src/components/atoms/CommonButton/CommonButton.jsx`

```javascript
export const CommonButton = ({ type, label, onClick }) => (
  <button className={styles.button} type={type} onClick={onClick}>
    {label}
  </button>
);
```

**特徴**:

- `type`でsubmit/button切り替え
- `onClick`は任意（フォーム送信の場合は不要）

#### NavigationLink

**場所**: `src/components/atoms/NavigationLink/NavigationLink.jsx`

```javascript
export const NavigationLink = ({ title, linkPath }) => (
  <li className={styles.li}>
    <NavLink to={linkPath}>{title}</NavLink>
  </li>
);
```

**特徴**:

- React Routerの`NavLink`をラップ
- スタイリングを隠蔽

### Atomsのindex.js

**場所**: `src/components/atoms/index.js`

```javascript
export { CommonButton } from './CommonButton';
export { InputForm } from './InputForm';
export { NavigationLink } from './NavigationLink';
export { TextArea } from './TextArea';
```

**目的**:

- インポートパスの簡略化
- `import { InputForm, CommonButton } from "../../atoms"`のように使用可能

## Molecules（中間コンポーネント層）

### 設計原則

- **Atomsの組み合わせ**: 複数のAtomsで構成
- **小さな機能単位**: 1つの明確な機能を提供
- **再利用可能**: 複数のOrganismsやTemplatesで使用可能

### 実装パターン

#### Navigation

**場所**: `src/components/molecules/Navigation/Navigation.jsx`

```javascript
export const Navigation = () => (
  <nav>
    <ul className={styles.ul}>
      <NavigationLink title={'Top'} linkPath={NAVIGATION_PATH.TOP} />
      <NavigationLink title={'Create'} linkPath={NAVIGATION_PATH.CREATE} />
    </ul>
  </nav>
);
```

**特徴**:

- `NavigationLink`（Atom）を複数組み合わせ
- ナビゲーションの構造を定義
- propsを受け取らず、固定のリンク構成

## Organisms（複合コンポーネント層）

### 設計原則

- **大きな機能単位**: ページの一部を構成する大きなブロック
- **Molecules + Atomsの組み合わせ**
- **一部ロジックを持つ**: ページ遷移など、自身の責務に関するロジックのみ

### 実装パターン

#### BaseLayout

**場所**: `src/components/organisms/BaseLayout/BaseLayout.jsx`

```javascript
export const BaseLayout = ({ children, title }) => (
  <div className={styles.container}>
    <section className={styles.common}>
      <Navigation />
    </section>
    <h1 className={styles.title}>{title}</h1>
    {children}
  </div>
);
```

**特徴**:

- 全ページ共通のレイアウト
- `Navigation`（Molecule）を含む
- `children`でページ固有コンテンツを受け取る

#### TodoList

**場所**: `src/components/organisms/TodoList/TodoList.jsx`

```javascript
export const TodoList = ({ todoList, handleDeleteTodo }) => {
  const navigate = useNavigate();

  const handleMoveDetailPage = useCallback(
    (id) => navigate(`${NAVIGATION_PATH.DETAIL}${id}`),
    [navigate],
  );

  const handleMoveEditPage = useCallback(
    (id) => navigate(`${NAVIGATION_PATH.EDIT}${id}`),
    [navigate],
  );

  return (
    <ul className={styles.list}>
      {todoList.map((todo) => (
        <li key={todo.id} className={styles.todo}>
          <span className={styles.task}>{todo.title}</span>
          <div className={styles.area}>
            <FontAwesomeIcon
              icon={faFile}
              onClick={() => handleMoveDetailPage(todo.id)}
            />
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={() => handleMoveEditPage(todo.id)}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={() => handleDeleteTodo(todo.id, todo.title)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
```

**特徴**:

- Todo一覧の表示とアクション実行
- ページ遷移ロジックを内包（自身の責務）
- 削除はprops経由で親に委譲（Context操作は親で実行）

## Templates（プレゼンテーション + ロジック統合層）

### 設計原則

- **ページレイアウト**: Organisms, Molecules, Atomsを組み合わせ
- **Context接続**: `useTodoContext()`でグローバル状態取得
- **専用フック使用**: Template固有のロジックは専用フックに分離
- **ビジネスロジック統合**: データ取得、フォーム管理、ページ遷移を統合

### 実装パターン

#### パターン1: 一覧表示テンプレート

**場所**: `src/components/templates/TodoListTemplate/`

##### TodoListTemplate.jsx

```javascript
export const TodoListTemplate = () => {
  const { originTodoList, deleteTodo } = useTodoContext();
  const { searchKeyword, showTodoList, handleChangeSearchKeyword } =
    useTodoListTemplate({ originTodoList });

  return (
    <BaseLayout title={'TodoList'}>
      <div className={styles.container}>
        <div className={styles.area}>
          <InputForm
            value={searchKeyword}
            placeholder={'Search Keyword'}
            onChange={handleChangeSearchKeyword}
          />
        </div>
        <div className={styles.area}>
          {showTodoList.length > 0 && (
            <TodoList todoList={showTodoList} handleDeleteTodo={deleteTodo} />
          )}
        </div>
      </div>
    </BaseLayout>
  );
};
```

##### useTodoListTemplate.js

```javascript
export const useTodoListTemplate = ({ originTodoList }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const showTodoList = useMemo(() => {
    const regexp = new RegExp('^' + searchKeyword, 'i');
    return originTodoList.filter((todo) => todo.title.match(regexp));
  }, [originTodoList, searchKeyword]);

  const handleChangeSearchKeyword = useCallback(
    (e) => setSearchKeyword(e.target.value),
    [],
  );

  return { searchKeyword, showTodoList, handleChangeSearchKeyword };
};
```

**責務分離**:

- **Template**: レイアウト構築 + Context接続
- **専用フック**: 検索ロジック + フィルタリング

#### パターン2: 作成テンプレート

**場所**: `src/components/templates/TodoCreateTemplate/`

##### TodoCreateTemplate.jsx

```javascript
export const TodoCreateTemplate = () => {
  const { addTodo } = useTodoContext();
  const {
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleCreateTodo,
  } = useTodoCreateTemplate({ addTodo });

  return (
    <BaseLayout title={'Create Todo'}>
      <form className={styles.container} onSubmit={handleCreateTodo}>
        <div className={styles.area}>
          <InputForm
            value={inputTitle}
            placeholder={'Title'}
            onChange={handleChangeTitle}
          />
        </div>
        <div className={styles.area}>
          <TextArea
            value={inputContent}
            placeholder={'Content'}
            onChange={handleChangeContent}
          />
        </div>
        <div className={styles.area}>
          <CommonButton type="submit" label="Create Todo" />
        </div>
      </form>
    </BaseLayout>
  );
};
```

##### useTopCreateTemplate.js

```javascript
export const useTodoCreateTemplate = ({ addTodo }) => {
  const navigate = useNavigate();
  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');

  const handleChangeTitle = useCallback(
    (e) => setInputTitle(e.target.value),
    [],
  );

  const handleChangeContent = useCallback(
    (e) => setInputContent(e.target.value),
    [],
  );

  const handleCreateTodo = useCallback(
    (e) => {
      e.preventDefault();
      if (inputTitle !== '' && inputContent !== '') {
        addTodo(inputTitle, inputContent);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [addTodo, inputTitle, inputContent, navigate],
  );

  return {
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleCreateTodo,
  };
};
```

**責務分離**:

- **Template**: フォームレイアウト + Context接続
- **専用フック**: フォーム状態管理 + 送信処理 + ページ遷移

#### パターン3: 編集テンプレート

**場所**: `src/components/templates/TodoEditTemplate/`

##### TodoEditTemplate.jsx

```javascript
export const TodoEditTemplate = () => {
  const { originTodoList, updateTodo } = useTodoContext();
  const {
    todo,
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleUpdateTodo,
  } = useTodoEditTemplate({ originTodoList, updateTodo });

  return (
    <BaseLayout title={'TodoEdit'}>
      {!!todo && (
        <form className={styles.container} onSubmit={handleUpdateTodo}>
          <div className={styles.area}>
            <InputForm
              value={inputTitle}
              placeholder={'Title'}
              onChange={handleChangeTitle}
            />
          </div>
          <div className={styles.area}>
            <TextArea
              value={inputContent}
              placeholder={'Content'}
              onChange={handleChangeContent}
            />
          </div>
          <div className={styles.area}>
            <CommonButton type="submit" label="Edit Todo" />
          </div>
        </form>
      )}
    </BaseLayout>
  );
};
```

##### useTodoEditTemplate.js

```javascript
export const useTodoEditTemplate = ({ originTodoList, updateTodo }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const todo = useMemo(
    () => originTodoList.find((todo) => String(todo.id) === id),
    [id, originTodoList],
  );

  const [inputTitle, setInputTitle] = useState(todo?.title || '');
  const [inputContent, setInputContent] = useState(todo?.content || '');

  const handleChangeTitle = useCallback(
    (e) => setInputTitle(e.target.value),
    [],
  );

  const handleChangeContent = useCallback(
    (e) => setInputContent(e.target.value),
    [],
  );

  const handleUpdateTodo = useCallback(
    (e) => {
      e.preventDefault();
      if (!!todo?.id && inputTitle !== '' && inputContent !== '') {
        updateTodo(todo.id, inputTitle, inputContent);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [navigate, todo?.id, inputTitle, inputContent, updateTodo],
  );

  return {
    todo,
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleUpdateTodo,
  };
};
```

**責務分離**:

- **Template**: フォームレイアウト + Context接続
- **専用フック**: URLパラメータ取得 + 対象Todo検索 + フォーム状態管理 + 更新処理 + ページ遷移

#### パターン4: 詳細表示テンプレート

**場所**: `src/components/templates/TodoDetailTemplate/TodoDetailTemplate.jsx`

```javascript
export const TodoDetailTemplate = () => {
  const { originTodoList } = useTodoContext();
  const { id } = useParams();
  const todo = originTodoList.find((todo) => String(todo.id) === id);

  return (
    <BaseLayout title={'TodoDetail'}>
      {!!todo && (
        <div className={styles.container}>
          <div className={styles.area}>
            <InputForm disabled value={todo.title} placeholder={'Title'} />
          </div>
          <div className={styles.area}>
            <TextArea disabled value={todo.content} placeholder={'Content'} />
          </div>
        </div>
      )}
    </BaseLayout>
  );
};
```

**特徴**:

- 専用フック不要（ロジックがシンプル）
- `disabled`属性でread-only表示
- URLパラメータから直接Todo取得

## Pages（ルーティング層）

### 設計原則

- **薄いラッパー**: Templateコンポーネントをそのまま返すだけ
- **ルーティングとの接続点**: Routerから呼ばれる
- **ロジックを持たない**: すべての処理はTemplateに委譲

### 実装パターン

```javascript
// src/pages/TodoListPage/TodoListPage.jsx
export const TodoListPage = () => <TodoListTemplate />;

// src/pages/TodoCreatePage/TodoCreatePage.jsx
export const TodoCreatePage = () => <TodoCreateTemplate />;

// src/pages/TodoEditPage/TodoEditPage.jsx
export const TodoEditPage = () => <TodoEditTemplate />;

// src/pages/TodoDetailPage/TodoDetailPage.jsx
export const TodoDetailPage = () => <TodoDetailTemplate />;
```

### Pagesのindex.js

```javascript
// src/pages/index.js
export { TodoCreatePage } from './TodoCreatePage';
export { TodoDetailPage } from './TodoDetailPage';
export { TodoEditPage } from './TodoEditPage';
export { TodoListPage } from './TodoListPage';
```

## コンポーネント実装チェックリスト

### Atoms作成時

- [ ] 単一のUI要素のみを実装
- [ ] propsで制御可能にする
- [ ] CSS Modulesでスタイルをスコープ化
- [ ] `index.js`でエクスポート

### Molecules作成時

- [ ] Atomsを組み合わせる
- [ ] 小さな機能単位にまとめる
- [ ] 再利用性を考慮
- [ ] `index.js`でエクスポート

### Organisms作成時

- [ ] Molecules + Atomsを組み合わせる
- [ ] 必要に応じてページ遷移ロジックを内包
- [ ] Context操作は避ける（propsで受け取る）
- [ ] `index.js`でエクスポート

### Templates作成時

- [ ] `useTodoContext()`で必要な状態・アクションを取得
- [ ] 専用カスタムフックを作成（`use[TemplateName].js`）
- [ ] Organisms, Molecules, Atomsを組み合わせてレイアウト構築
- [ ] `BaseLayout`で全体をラップ
- [ ] `index.js`でエクスポート

### Pages作成時

- [ ] Templateをラップするだけの薄い実装
- [ ] ロジックを持たせない
- [ ] `index.js`でエクスポート
- [ ] `router/index.jsx`にルート追加
