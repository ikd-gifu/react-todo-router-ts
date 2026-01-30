# 実装ルール

## 命名規則

### ファイル名

- **コンポーネント**: PascalCase（例: `TodoList.tsx`, `InputForm.tsx`）
- **フック**: camelCase + `use`プレフィックス（例: `useTodo.ts`, `useTodoListTemplate.ts`）
- **定数**: camelCase（例: `navigation.ts`, `data.ts`）
- **型定義**: PascalCase（例: `Todo.ts`）
- **スタイル**: `style.module.css`（固定）

### コンポーネント名

- **単一単語は避ける**: `Button` → `CommonButton`
- **機能を表す**: `TodoList`, `TodoCreateTemplate`
- **階層を反映しない**: `AtomButton`❌ → `CommonButton`✅

### 関数名

- **イベントハンドラ**: `handle`プレフィックス（例: `handleCreateTodo`, `handleChangeTitle`）
- **ページ遷移**: `handleMove[PageName]`（例: `handleMoveDetailPage`, `handleMoveEditPage`）
- **boolean返却**: `is`プレフィックス（例: `isValid`, `isLoading`）

### 変数名

- **配列**: 複数形（例: `todoList`, `originalTodoList`）
- **boolean**: `is`/`has`プレフィックス（例: `isOpen`, `hasError`）
- **状態**: 明確な名前（例: `inputTitle`, `searchKeyword`）

## インポート順序

```typescript
// 1. React関連
import { useState, useCallback, useMemo, FC } from "react";

// 2. 外部ライブラリ
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 3. 型定義
import { TodoType } from "../../../types/Todo";

// 4. 内部モジュール（絶対パス風に並べる）
import { useTodoContext } from "../../../hooks/useTodoContext";
import { BaseLayout } from "../../organisms";
import { InputForm, CommonButton } from "../../atoms";
import { NAVIGATION_PATH } from "../../../constants/navigation";

// 5. スタイル
import styles from "./style.module.css";
```

## エクスポートパターン

### Named Export（推奨）

```typescript
// 定義
export const TodoList: FC<TodoListProps> = ({ todoList }) => { ... };

// インポート
import { TodoList } from "./TodoList";
```

### index.tsでの再エクスポート

```typescript
// src/components/atoms/index.ts
export { CommonButton } from "./CommonButton";
export { InputForm } from "./InputForm";
export { NavigationLink } from "./NavigationLink";
export { TextArea } from "./TextArea";
```

**使用例**:

```typescript
import { InputForm, CommonButton, TextArea } from "../../atoms";
```

## State管理ルール

### useState

```typescript
// ✅ 初期値を明示
const [inputTitle, setInputTitle] = useState<string>("");
const [searchKeyword, setSearchKeyword] = useState<string>("");

// ✅ オプショナルチェーン for 初期値
const [inputTitle, setInputTitle] = useState<string>(todo?.title || "");

// ❌ 不必要な初期値
const [count, setCount] = useState<number>(0); // 使わないなら定義しない
```

### useCallback

```typescript
// ✅ イベントハンドラは useCallback
const handleChangeTitle = useCallback(
  (e: ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value),
  []
);

// ✅ 依存配列を正確に
const handleCreateTodo = useCallback(
  (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputTitle !== "" && inputContent !== "") {
      handleCreateTodo(inputTitle, inputContent);
      navigate(NAVIGATION_PATH.TOP);
    }
  },
  [handleCreateTodo, inputTitle, inputContent, navigate]
);

// ❌ 依存配列を省略
const handleClick = () => { ... }; // 毎回再生成される
```

### useMemo

```typescript
// ✅ 重い計算処理は useMemo
const showTodoList = useMemo(() => {
  const regexp = new RegExp("^" + searchKeyword, "i");
  return originalTodoList.filter((todo) => todo.title.match(regexp));
}, [originalTodoList, searchKeyword]);

// ✅ 検索処理も useMemo
const todo = useMemo(
  () => originalTodoList.find((todo) => String(todo.id) === id),
  [id, originalTodoList]
);

// ❌ シンプルな計算に使わない
const total = useMemo(() => a + b, [a, b]); // 不要
```

## Context使用ルール

### Context接続

```javascript
// ✅ useTodoContext を使用
const { originalTodoList, handleCreateTodo } = useTodoContext();

// ❌ 直接useContextを使用しない
const context = useContext(TodoContext); // useTodoContextを使うべき
```

### 必要な値だけ取得

```javascript
// ✅ 必要な値だけ分割代入
const { originalTodoList, handleDeleteTodo } = useTodoContext();

// ❌ 使わない値まで取得
const { originalTodoList, handleCreateTodo, handleUpdateTodo, handleDeleteTodo } = useTodoContext();
// この例でhandleCreateTodo, handleUpdateTodoを使っていないなら不要
```

## Props設計ルール

### Props定義

```typescript
// ✅ 必要最小限のpropsを型定義
type InputFormProps = ComponentProps<"input">;
export const InputForm: FC<InputFormProps> = ({ value, placeholder, onChange, disabled = false }) => { ... };

// ✅ オプショナルなpropsは初期値設定
type CommonButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
};
export const CommonButton: FC<CommonButtonProps> = ({ type = "button", children, onClick }) => { ... };

// ❌ 過剰なprops
type InputFormProps = {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  className: string;
  style: CSSProperties;
  // ...その他多数
};
```

### Props drilling回避

```javascript
// ✅ Context API で直接取得
const TodoListTemplate = () => {
  const { handleDeleteTodo } = useTodoContext();
  return <TodoList handleDeleteTodo={handleDeleteTodo} />;
};

// ❌ 不要な中間コンポーネント経由
const Parent = ({ handleDeleteTodo }) => <Child handleDeleteTodo={handleDeleteTodo} />;
const Child = ({ handleDeleteTodo }) => <GrandChild handleDeleteTodo={handleDeleteTodo} />;
```

## フォーム実装ルール

### 制御されたコンポーネント

```typescript
// ✅ value + onChange でバインド
<InputForm
  value={inputTitle}
  onChange={handleChangeTitle}
/>

// ❌ 非制御コンポーネント
<input ref={inputRef} /> // Reactの管理外
```

### フォーム送信

```javascript
// ✅ onSubmit + preventDefault
<form onSubmit={handleCreateTodo}>
  <CommonButton type="submit" label="Create Todo" />
</form>;

const handleCreateTodo = useCallback((e) => {
  e.preventDefault();
  // 処理
}, []);

// ❌ onClick でフォーム送信
<CommonButton onClick={handleCreateTodo} />; // ページリロードが発生
```

### バリデーション

```javascript
// ✅ 送信前にバリデーション
const handleCreateTodo = useCallback(
  (e) => {
    e.preventDefault();
    if (inputTitle !== '' && inputContent !== '') {
      handleCreateTodo(inputTitle, inputContent);
      navigate(NAVIGATION_PATH.TOP);
    }
  },
  [handleCreateTodo, inputTitle, inputContent, navigate],
);

// ❌ バリデーションなし
const handleCreateTodo = useCallback((e) => {
  e.preventDefault();
  handleCreateTodo(inputTitle, inputContent); // 空文字でも追加される
}, []);
```

## ルーティング実装ルール

### パス定義の使用

```javascript
// ✅ 定数を使用
navigate(NAVIGATION_PATH.TOP);
navigate(`${NAVIGATION_PATH.DETAIL}${id}`);

// ❌ ハードコーディング
navigate('/react-output-router-v2/');
navigate(`/react-output-router-v2/detail/${id}`);
```

### useNavigateの使用

```javascript
// ✅ useCallback内で使用
const navigate = useNavigate();

const handleCreateTodo = useCallback(
  (e) => {
    e.preventDefault();
    handleCreateTodo(inputTitle, inputContent);
    navigate(NAVIGATION_PATH.TOP);
  },
  [handleCreateTodo, inputTitle, inputContent, navigate],
);

// ❌ 直接呼び出し
<CommonButton onClick={() => navigate(NAVIGATION_PATH.TOP)} />;
// パフォーマンス低下
```

### useParamsの型変換

```javascript
// ✅ 明示的な型変換
const { id } = useParams();
const todo = originalTodoList.find((todo) => String(todo.id) === id);

// ❌ 暗黙的な型変換
const todo = originalTodoList.find((todo) => todo.id == id); // 型変換依存
```

## スタイリングルール

### CSS Modules

```javascript
// ✅ CSS Modules を使用
import styles from "./style.module.css";
<div className={styles.container}>...</div>

// ❌ グローバルCSS
<div className="container">...</div>
```

### クラス名

```css
/* ✅ kebab-case */
.todo-list { ... }
.input-form { ... }

/* ❌ camelCase */
.todoList { ... }
.inputForm { ... }
```

## エラーハンドリング

### 存在チェック

```javascript
// ✅ オプショナルチェーン
{
  !!todo && (
    <div>
      <InputForm value={todo.title} />
    </div>
  );
}

// ✅ Optional chaining
const [inputTitle, setInputTitle] = useState(todo?.title || '');

// ❌ チェックなし
<InputForm value={todo.title} />; // todoがundefinedでエラー
```

### 削除確認

```javascript
// ✅ window.confirm で確認
const handleDeleteTodo = useCallback(
  (targetId, targetTitle) => {
    if (window.confirm(`「${targetTitle}」のtodoを削除しますか？`)) {
      const newTodoList = originalTodoList.filter((todo) => todo.id !== targetId);
      setOriginalTodoList(newTodoList);
    }
  },
  [originalTodoList],
);

// ❌ 確認なし
const handleDeleteTodo = (targetId) => {
  setOriginalTodoList(originalTodoList.filter((todo) => todo.id !== targetId));
};
```

## パフォーマンス最適化

### 不変性の維持

```javascript
// ✅ 新しい配列を作成
const newTodoList = [...originalTodoList, { id: nextUniqueId, title, content }];
setOriginalTodoList(newTodoList);

// ❌ 元の配列を変更
originalTodoList.push({ id: nextUniqueId, title, content });
setOriginalTodoList(originalTodoList); // 再レンダリングされない
```

### key属性

```javascript
// ✅ 一意のidを使用
{
  todoList.map((todo) => <li key={todo.id}>{todo.title}</li>);
}

// ❌ indexを使用
{
  todoList.map((todo, index) => <li key={index}>{todo.title}</li>);
}
```

## コメントルール

### JSDoc形式

```javascript
/**
 * Todo新規登録処理
 * @param {string} title - Todoタイトル
 * @param {string} content - Todo内容
 */
const handleCreateTodo = useCallback((title, content) => {
  // 実装
}, []);
```

### 複雑なロジックの説明

```javascript
// useMemoの第二引数([originalTodoList, searchKeyword])に依存して処理が実行される
// originalTodoListとsearchKeywordの値が変更される度にfilterの検索処理が実行
// ただし結果が前回と同じならキャッシュを返却し処理は実行されない
const showTodoList = useMemo(() => {
  const regexp = new RegExp('^' + searchKeyword, 'i');
  return originalTodoList.filter((todo) => todo.title.match(regexp));
}, [originalTodoList, searchKeyword]);
```

## ファイル構造ルール

### コンポーネントフォルダ

```
ComponentName/
  ├── index.ts           # エクスポート
  ├── ComponentName.tsx  # コンポーネント本体
  ├── style.module.css   # スタイル
  └── useComponentName.ts # 専用フック（Templateのみ）
```

### index.tsの役割

```typescript
// Templateの場合
export { TodoListTemplate } from "./TodoListTemplate";

// Atomsなどのindex.ts
export { CommonButton } from "./CommonButton";
export { InputForm } from "./InputForm";
```

## 実装チェックリスト

コンポーネント作成時、以下を確認:

- [ ] 命名規則に従っている
- [ ] インポート順序が正しい
- [ ] Named Exportを使用
- [ ] useCallback / useMemo で最適化
- [ ] propsは必要最小限
- [ ] CSS Modulesを使用
- [ ] 型変換を明示的に
- [ ] エラーハンドリング実装
- [ ] 不変性を維持
- [ ] key属性を適切に設定
- [ ] index.jsでエクスポート
