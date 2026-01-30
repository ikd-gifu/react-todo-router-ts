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

**場所**: `src/components/atoms/InputForm/InputForm.tsx`

```typescript
import { FC, ComponentProps } from "react";
import styles from "./style.module.css";

type InputFormProps = ComponentProps<"input">;

export const InputForm: FC<InputFormProps> = ({
  disabled = false,
  value,
  placeholder,
  onChange,
  onKeyDown,
}) => (
  <input
    disabled={disabled}
    className={styles.input}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);
```

**特徴**:

- 制御されたコンポーネント（`value` + `onChange`）
- `disabled`でread-only対応
- 最小限のprops

#### CommonButton

**場所**: `src/components/atoms/CommonButton/CommonButton.tsx`

```typescript
import { FC, ComponentProps, ReactNode } from "react";
import styles from "./style.module.css";

type CommonButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export const CommonButton: FC<CommonButtonProps> = ({
  type,
  children,
  onClick,
}) => (
  <button className={styles.button} type={type} onClick={onClick}>
    {children}
  </button>
);
```

**特徴**:

- `type`でsubmit/button切り替え
- `onClick`は任意（フォーム送信の場合は不要）

#### NavigationLink

**場所**: `src/components/atoms/NavigationLink/NavigationLink.tsx`

```typescript
import { FC } from "react";
import { NavLink } from "react-router";
import styles from "./style.module.css";

type NavigationLinkProps = {
  title: string;
  linkPath: string;
};

export const NavigationLink: FC<NavigationLinkProps> = ({
  title,
  linkPath,
}) => (
  <li className={styles.li}>
    <NavLink to={linkPath}>{title}</NavLink>
  </li>
);
```

**特徴**:

- React Routerの`NavLink`をラップ
- スタイリングを隠蔽

### Atomsのindex.ts

**場所**: `src/components/atoms/index.ts`

```typescript
export { CommonButton } from "./CommonButton";
export { InputForm } from "./InputForm";
export { NavigationLink } from "./NavigationLink";
export { TextArea } from "./TextArea";
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

**場所**: `src/components/molecules/Navigation/Navigation.tsx`

```typescript
import { NavigationLink } from "../../atoms";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import styles from "./style.module.css";

export const Navigation = () => (
  <nav>
    <ul className={styles.ul}>
      <NavigationLink title={"Top"} linkPath={NAVIGATION_PATH.TOP} />
      <NavigationLink title={"Create"} linkPath={NAVIGATION_PATH.CREATE} />
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

**場所**: `src/components/organisms/BaseLayout/BaseLayout.tsx`

```typescript
import { FC, ReactNode } from "react";
import { Navigation } from "../../molecules";
import styles from "./style.module.css";

type BaseLayoutProps = {
  children: ReactNode;
  title: string;
};

export const BaseLayout: FC<BaseLayoutProps> = ({ children, title }) => (
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

**場所**: `src/components/organisms/TodoList/TodoList.tsx`

```typescript
import { FC, useCallback } from "react";
import { useNavigate } from "react-router";
import { TodoType } from "../../../types/Todo";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPenToSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";

type TodoListProps = {
  todoList: Array<TodoType>;
  handleDeleteTodo: (targetId: number, targetTitle: string) => void;
};

export const TodoList: FC<TodoListProps> = ({ todoList, handleDeleteTodo }) => {
  const navigate = useNavigate();

  const handleMoveDetailPage = useCallback(
    (id: number) => navigate(`${NAVIGATION_PATH.DETAIL}${id}`),
    [navigate]
  );

  const handleMoveEditPage = useCallback(
    (id: number) => navigate(`${NAVIGATION_PATH.EDIT}${id}`),
    [navigate]
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

##### TodoListTemplate.tsx

```typescript
import { BaseLayout, TodoList } from "../../organisms";
import { InputForm } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import { useTodoListTemplate } from "./useTodoListTemplate";
import styles from "./style.module.css";

export const TodoListTemplate = () => {
  const { originalTodoList, handleDeleteTodo } = useTodoContext();
  const { searchKeyword, showTodoList, handleChangeSearchKeyword } =
    useTodoListTemplate({ originalTodoList });

  return (
    <BaseLayout title={"TodoList"}>
      <div className={styles.container}>
        <div className={styles.area}>
          <InputForm
            value={searchKeyword}
            placeholder={"Search Keyword"}
            onChange={handleChangeSearchKeyword}
          />
        </div>
        <div className={styles.area}>
          {showTodoList.length > 0 && (
            <TodoList todoList={showTodoList} handleDeleteTodo={handleDeleteTodo} />
          )}
        </div>
      </div>
    </BaseLayout>
  );
};
```

##### useTodoListTemplate.ts

```typescript
import { useMemo, useState, useCallback, ChangeEvent } from "react";
import { TodoType } from "../../../types/Todo";

type UseTodoListTemplateParams = {
  originalTodoList: Array<TodoType>;
};

export const useTodoListTemplate = ({
  originalTodoList,
}: UseTodoListTemplateParams) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const showTodoList = useMemo(() => {
    const regexp = new RegExp("^" + searchKeyword, "i");
    return originalTodoList.filter((todo) => todo.title.match(regexp));
  }, [originalTodoList, searchKeyword]);

  const handleChangeSearchKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value),
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

##### TodoCreateTemplate.tsx

```typescript
import { BaseLayout } from "../../organisms";
import { InputForm, TextArea, CommonButton } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import { useTodoCreateTemplate } from "./useTodoCreateTemplate";
import styles from "./style.module.css";

export const TodoCreateTemplate = () => {
  const { handleCreateTodo } = useTodoContext();
  const {
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleCreateTodo,
  } = useTodoCreateTemplate({ handleCreateTodo });

  return (
    <BaseLayout title={"Create Todo"}>
      <form className={styles.container} onSubmit={handleCreateTodo}>
        <div className={styles.area}>
          <InputForm
            value={inputTitle}
            placeholder={"Title"}
            onChange={handleChangeTitle}
          />
        </div>
        <div className={styles.area}>
          <TextArea
            value={inputContent}
            placeholder={"Content"}
            onChange={handleChangeContent}
          />
        </div>
        <div className={styles.area}>
          <CommonButton type="submit">Create Todo</CommonButton>
        </div>
      </form>
    </BaseLayout>
  );
};
```

##### useTodoCreateTemplate.ts

```typescript
import { useState, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { NAVIGATION_PATH } from "../../../constants/navigation";

type UseTodoCreateTemplateParams = {
  handleCreateTodo: (title: string, content: string) => void;
};

export const useTodoCreateTemplate = ({
  handleCreateTodo,
}: UseTodoCreateTemplateParams) => {
  const navigate = useNavigate();
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value),
    [],
  );

  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setInputContent(e.target.value),
    [],
  );

  const handleCreateTodo = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputTitle !== "" && inputContent !== "") {
        handleCreateTodo(inputTitle, inputContent);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [handleCreateTodo, inputTitle, inputContent, navigate],
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

##### TodoEditTemplate.tsx

```typescript
import { BaseLayout } from "../../organisms";
import { InputForm, TextArea, CommonButton } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import { useTodoEditTemplate } from "./useTodoEditTemplate";
import styles from "./style.module.css";

export const TodoEditTemplate = () => {
  const { originalTodoList, handleUpdateTodo } = useTodoContext();
  const {
    todo,
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleUpdateTodo,
  } = useTodoEditTemplate({ originalTodoList, handleUpdateTodo });

  return (
    <BaseLayout title={"TodoEdit"}>
      {!!todo && (
        <form className={styles.container} onSubmit={handleUpdateTodo}>
          <div className={styles.area}>
            <InputForm
              value={inputTitle}
              placeholder={"Title"}
              onChange={handleChangeTitle}
            />
          </div>
          <div className={styles.area}>
            <TextArea
              value={inputContent}
              placeholder={"Content"}
              onChange={handleChangeContent}
            />
          </div>
          <div className={styles.area}>
            <CommonButton type="submit">Edit Todo</CommonButton>
          </div>
        </form>
      )}
    </BaseLayout>
  );
};
```

##### useTodoEditTemplate.ts

```typescript
import { useMemo, useState, useCallback, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { TodoType } from "../../../types/Todo";

type UseTodoEditTemplateParams = {
  originalTodoList: Array<TodoType>;
  handleUpdateTodo: (id: number, title: string, content: string) => void;
};

export const useTodoEditTemplate = ({
  originalTodoList,
  handleUpdateTodo,
}: UseTodoEditTemplateParams) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const todo = useMemo(
    () => originalTodoList.find((todo) => String(todo.id) === id),
    [id, originalTodoList],
  );

  const [inputTitle, setInputTitle] = useState(todo?.title || "");
  const [inputContent, setInputContent] = useState(todo?.content || "");

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value),
    [],
  );

  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setInputContent(e.target.value),
    [],
  );

  const handleUpdateTodo = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!!todo?.id && inputTitle !== "" && inputContent !== "") {
        handleUpdateTodo(todo.id, inputTitle, inputContent);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [navigate, todo?.id, inputTitle, inputContent, handleUpdateTodo],
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

**場所**: `src/components/templates/TodoDetailTemplate/TodoDetailTemplate.tsx`

```typescript
import { useParams } from "react-router";
import { BaseLayout } from "../../organisms";
import { InputForm, TextArea } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import styles from "./style.module.css";

export const TodoDetailTemplate = () => {
  const { originalTodoList } = useTodoContext();
  const { id } = useParams();
  const todo = originalTodoList.find((todo) => String(todo.id) === id);

  return (
    <BaseLayout title={"TodoDetail"}>
      {!!todo && (
        <div className={styles.container}>
          <div className={styles.area}>
            <InputForm disabled value={todo.title} placeholder={"Title"} />
          </div>
          <div className={styles.area}>
            <TextArea disabled value={todo.content} placeholder={"Content"} />
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
- [ ] `router/index.jsx`にルート追加# コンポーネント設計パターン

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

**場所**: `src/components/atoms/InputForm/InputForm.tsx`

```typescript
import { FC, ComponentProps } from "react";
import styles from "./style.module.css";

type InputFormProps = ComponentProps<"input">;

export const InputForm: FC<InputFormProps> = ({
  disabled = false,
  value,
  placeholder,
  onChange,
  onKeyDown,
}) => (
  <input
    disabled={disabled}
    className={styles.input}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);
```

**特徴**:

- 制御されたコンポーネント（`value` + `onChange`）
- `disabled`でread-only対応
- 最小限のprops

#### CommonButton

**場所**: `src/components/atoms/CommonButton/CommonButton.tsx`

```typescript
import { FC, ComponentProps, ReactNode } from "react";
import styles from "./style.module.css";

type CommonButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
};

export const CommonButton: FC<CommonButtonProps> = ({
  type,
  children,
  onClick,
}) => (
  <button className={styles.button} type={type} onClick={onClick}>
    {children}
  </button>
);
```

**特徴**:

- `type`でsubmit/button切り替え
- `onClick`は任意（フォーム送信の場合は不要）

#### NavigationLink

**場所**: `src/components/atoms/NavigationLink/NavigationLink.tsx`

```typescript
import { FC } from "react";
import { NavLink } from "react-router";
import styles from "./style.module.css";

type NavigationLinkProps = {
  title: string;
  linkPath: string;
};

export const NavigationLink: FC<NavigationLinkProps> = ({
  title,
  linkPath,
}) => (
  <li className={styles.li}>
    <NavLink to={linkPath}>{title}</NavLink>
  </li>
);
```

**特徴**:

- React Routerの`NavLink`をラップ
- スタイリングを隠蔽

### Atomsのindex.ts

**場所**: `src/components/atoms/index.ts`

```typescript
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

**場所**: `src/components/molecules/Navigation/Navigation.tsx`

```typescript
import { NavigationLink } from "../../atoms";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import styles from "./style.module.css";

export const Navigation = () => (
  <nav>
    <ul className={styles.ul}>
      <NavigationLink title={"Top"} linkPath={NAVIGATION_PATH.TOP} />
      <NavigationLink title={"Create"} linkPath={NAVIGATION_PATH.CREATE} />
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

**場所**: `src/components/organisms/BaseLayout/BaseLayout.tsx`

```typescript
import { FC, ReactNode } from "react";
import { Navigation } from "../../molecules";
import styles from "./style.module.css";

type BaseLayoutProps = {
  children: ReactNode;
  title: string;
};

export const BaseLayout: FC<BaseLayoutProps> = ({ children, title }) => (
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

**場所**: `src/components/organisms/TodoList/TodoList.tsx`

```typescript
import { FC, useCallback } from "react";
import { useNavigate } from "react-router";
import { TodoType } from "../../../types/Todo";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPenToSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";

type TodoListProps = {
  todoList: Array<TodoType>;
  handleDeleteTodo: (targetId: number, targetTitle: string) => void;
};

export const TodoList: FC<TodoListProps> = ({ todoList, handleDeleteTodo }) => {
  const navigate = useNavigate();

  const handleMoveDetailPage = useCallback(
    (id: number) => navigate(`${NAVIGATION_PATH.DETAIL}${id}`),
    [navigate]
  );

  const handleMoveEditPage = useCallback(
    (id: number) => navigate(`${NAVIGATION_PATH.EDIT}${id}`),
    [navigate]
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

##### TodoListTemplate.tsx

```typescript
import { BaseLayout, TodoList } from "../../organisms";
import { InputForm } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import { useTodoListTemplate } from "./useTodoListTemplate";
import styles from "./style.module.css";

export const TodoListTemplate = () => {
  const { originalTodoList, handleDeleteTodo } = useTodoContext();
  const { searchKeyword, showTodoList, handleChangeSearchKeyword } =
    useTodoListTemplate({ originalTodoList });

  return (
    <BaseLayout title={"TodoList"}>
      <div className={styles.container}>
        <div className={styles.area}>
          <InputForm
            value={searchKeyword}
            placeholder={"Search Keyword"}
            onChange={handleChangeSearchKeyword}
          />
        </div>
        <div className={styles.area}>
          {showTodoList.length > 0 && (
            <TodoList todoList={showTodoList} handleDeleteTodo={handleDeleteTodo} />
          )}
        </div>
      </div>
    </BaseLayout>
  );
};
```

##### useTodoListTemplate.ts

```typescript
import { useMemo, useState, useCallback, ChangeEvent } from "react";
import { TodoType } from "../../../types/Todo";

type UseTodoListTemplateParams = {
  originalTodoList: Array<TodoType>;
};

export const useTodoListTemplate = ({
  originalTodoList,
}: UseTodoListTemplateParams) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const showTodoList = useMemo(() => {
    const regexp = new RegExp('^' + searchKeyword, 'i');
    return originalTodoList.filter((todo) => todo.title.match(regexp));
  }, [originalTodoList, searchKeyword]);

  const handleChangeSearchKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value),
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

##### TodoCreateTemplate.tsx

```typescript
import { BaseLayout } from "../../organisms";
import { InputForm, TextArea, CommonButton } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import { useTodoCreateTemplate } from "./useTodoCreateTemplate";
import styles from "./style.module.css";

export const TodoCreateTemplate = () => {
  const { handleCreateTodo } = useTodoContext();
  const {
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleCreateTodo,
  } = useTodoCreateTemplate({ handleCreateTodo });

  return (
    <BaseLayout title={"Create Todo"}>
      <form className={styles.container} onSubmit={handleCreateTodo}>
        <div className={styles.area}>
          <InputForm
            value={inputTitle}
            placeholder={"Title"}
            onChange={handleChangeTitle}
          />
        </div>
        <div className={styles.area}>
          <TextArea
            value={inputContent}
            placeholder={"Content"}
            onChange={handleChangeContent}
          />
        </div>
        <div className={styles.area}>
          <CommonButton type="submit">Create Todo</CommonButton>
        </div>
      </form>
    </BaseLayout>
  );
};
```

##### useTodoCreateTemplate.ts

```typescript
import { useState, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { NAVIGATION_PATH } from "../../../constants/navigation";

type UseTodoCreateTemplateParams = {
  handleCreateTodo: (title: string, content: string) => void;
};

export const useTodoCreateTemplate = ({
  handleCreateTodo,
}: UseTodoCreateTemplateParams) => {
  const navigate = useNavigate();
  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value),
    [],
  );

  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setInputContent(e.target.value),
    [],
  );

  const handleCreateTodo = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputTitle !== '' && inputContent !== '') {
        handleCreateTodo(inputTitle, inputContent);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [handleCreateTodo, inputTitle, inputContent, navigate],
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

##### TodoEditTemplate.tsx

```typescript
import { BaseLayout } from "../../organisms";
import { InputForm, TextArea, CommonButton } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import { useTodoEditTemplate } from "./useTodoEditTemplate";
import styles from "./style.module.css";

export const TodoEditTemplate = () => {
  const { originalTodoList, handleUpdateTodo } = useTodoContext();
  const {
    todo,
    inputTitle,
    inputContent,
    handleChangeTitle,
    handleChangeContent,
    handleUpdateTodo,
  } = useTodoEditTemplate({ originalTodoList, handleUpdateTodo });

  return (
    <BaseLayout title={"TodoEdit"}>
      {!!todo && (
        <form className={styles.container} onSubmit={handleUpdateTodo}>
          <div className={styles.area}>
            <InputForm
              value={inputTitle}
              placeholder={"Title"}
              onChange={handleChangeTitle}
            />
          </div>
          <div className={styles.area}>
            <TextArea
              value={inputContent}
              placeholder={"Content"}
              onChange={handleChangeContent}
            />
          </div>
          <div className={styles.area}>
            <CommonButton type="submit">Edit Todo</CommonButton>
          </div>
        </form>
      )}
    </BaseLayout>
  );
};
```

##### useTodoEditTemplate.ts

```typescript
import { useMemo, useState, useCallback, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { TodoType } from "../../../types/Todo";

type UseTodoEditTemplateParams = {
  originalTodoList: Array<TodoType>;
  handleUpdateTodo: (id: number, title: string, content: string) => void;
};

export const useTodoEditTemplate = ({
  originalTodoList,
  handleUpdateTodo,
}: UseTodoEditTemplateParams) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const todo = useMemo(
    () => originalTodoList.find((todo) => String(todo.id) === id),
    [id, originalTodoList],
  );

  const [inputTitle, setInputTitle] = useState(todo?.title || '');
  const [inputContent, setInputContent] = useState(todo?.content || '');

  const handleChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value),
    [],
  );

  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setInputContent(e.target.value),
    [],
  );

  const handleUpdateTodo = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!!todo?.id && inputTitle !== '' && inputContent !== '') {
        handleUpdateTodo(todo.id, inputTitle, inputContent);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [navigate, todo?.id, inputTitle, inputContent, handleUpdateTodo],
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

**場所**: `src/components/templates/TodoDetailTemplate/TodoDetailTemplate.tsx`

```typescript
import { useParams } from "react-router";
import { BaseLayout } from "../../organisms";
import { InputForm, TextArea } from "../../atoms";
import { useTodoContext } from "../../../hooks/useTodoContext";
import styles from "./style.module.css";

export const TodoDetailTemplate = () => {
  const { originalTodoList } = useTodoContext();
  const { id } = useParams();
  const todo = originalTodoList.find((todo) => String(todo.id) === id);

  return (
    <BaseLayout title={"TodoDetail"}>
      {!!todo && (
        <div className={styles.container}>
          <div className={styles.area}>
            <InputForm disabled value={todo.title} placeholder={"Title"} />
          </div>
          <div className={styles.area}>
            <TextArea disabled value={todo.content} placeholder={"Content"} />
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
