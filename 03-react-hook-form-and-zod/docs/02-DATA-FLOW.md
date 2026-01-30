# データフロー設計

## 全体のデータフロー図

```
[useTodo] ──提供──> [TodoContext/TodoProvider] ──提供──> [Templates]
                                                              │
                                                              ├──取得──> [useTodoContext]
                                                              │
                                                              └──使用──> [Template専用カスタムフック]
                                                                         │
                                                                         └──表示──> [Organisms/Molecules/Atoms]
```

## 状態管理の流れ

### 1. 状態の定義と初期化（useTodo）

**場所**: `src/hooks/useTodo.ts`

**責務**:

- `originalTodoList`: Todo配列の状態管理
- `uniqueId`: Todo採番用ID管理
- `handleCreateTodo`: Todo追加ロジック
- `handleUpdateTodo`: Todo更新ロジック
- `handleDeleteTodo`: Todo削除ロジック

**重要**: このフックはContextに依存しない。純粋なビジネスロジックとして独立。

### 2. Contextへの接続（TodoContext）

**場所**: `src/contexts/TodoContext.tsx`

**責務**:

- `useTodo`から状態とアクションを受け取る
- `TodoProvider`でラップした配下のコンポーネントに提供
- Context定義の`TodoContext`をエクスポート（useTodoContextで使用）

**提供する値**:

```typescript
type TodoContextType = {
  originalTodoList: Array<TodoType>;
  handleCreateTodo: (title: string, content: string) => void;
  handleUpdateTodo: (id: number, title: string, content: string) => void;
  handleDeleteTodo: (targetId: number, targetTitle: string) => void;
};
```

### 3. Contextの利用（useTodoContext）

**場所**: `src/hooks/useTodoContext.ts`

**責務**:

- `TodoContext`からコンテキスト値を取得するヘルパーフック
- テンプレートコンポーネントで使用

**使い方**:

```typescript
const {
  originalTodoList,
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo,
} = useTodoContext();
```

### 4. テンプレートでの状態利用

**場所**: `src/components/templates/*/`

各テンプレートは以下のパターンで実装:

#### パターン1: 一覧表示（TodoListTemplate）

```typescript
// 1. Contextから状態取得
const { originalTodoList, handleDeleteTodo } = useTodoContext();

// 2. Template専用フックで表示ロジック管理
const { searchKeyword, showTodoList, handleChangeSearchKeyword } =
  useTodoListTemplate({ originalTodoList });

// 3. 子コンポーネントに渡す
<TodoList todoList={showTodoList} handleDeleteTodo={handleDeleteTodo} />;
```

#### パターン2: 新規作成（TodoCreateTemplate）

```typescript
// 1. Contextからアクション取得
const { handleCreateTodo } = useTodoContext();

// 2. Template専用フックでフォーム状態管理
const {
  inputTitle,
  inputContent,
  handleChangeTitle,
  handleChangeContent,
  handleCreateTodo,
} = useTodoCreateTemplate({ handleCreateTodo });

// 3. フォームコンポーネントに渡す
<InputForm value={inputTitle} onChange={handleChangeTitle} />;
```

#### パターン3: 編集（TodoEditTemplate）

```typescript
// 1. Contextから状態とアクション取得
const { originalTodoList, handleUpdateTodo } = useTodoContext();

// 2. Template専用フックで編集対象取得 + フォーム管理
const {
  todo,
  inputTitle,
  inputContent,
  handleChangeTitle,
  handleChangeContent,
  handleUpdateTodo,
} = useTodoEditTemplate({ originalTodoList, handleUpdateTodo });

// 3. フォームコンポーネントに渡す
```

#### パターン4: 詳細表示（TodoDetailTemplate）

```typescript
// 1. Contextから状態取得
const { originalTodoList } = useTodoContext();

// 2. URLパラメータから対象Todo取得
const { id } = useParams();
const todo = originalTodoList.find((todo) => String(todo.id) === id);

// 3. 表示コンポーネントに渡す（専用フック不要）
```

## ページ遷移時のデータの流れ

### 作成フロー

```
TodoCreateTemplate
  ├─> フォーム入力（ローカル状態）
  ├─> handleCreateTodo実行
  ├─> handleCreateTodo（Context経由）実行
  ├─> originalTodoList更新
  └─> navigate(NAVIGATION_PATH.TOP)でトップへ遷移
```

### 編集フロー

```
TodoList（一覧）
  ├─> 編集アイコンクリック
  ├─> navigate(`${NAVIGATION_PATH.EDIT}${id}`)で編集ページへ
  └─> TodoEditTemplate
       ├─> useParams()でidを取得
       ├─> originalTodoListから該当Todoを検索
       ├─> フォームに初期値をセット
       ├─> handleUpdateTodo実行
       ├─> handleUpdateTodo（Context経由）実行
       ├─> originalTodoList更新
       └─> navigate(NAVIGATION_PATH.TOP)でトップへ遷移
```

### 削除フロー

```
TodoList（一覧）
  ├─> 削除アイコンクリック
  ├─> handleDeleteTodo（props経由）実行
  ├─> handleDeleteTodo（Context経由）実行
  ├─> window.confirm()で確認
  ├─> originalTodoList更新（filterで対象を除外）
  └─> 一覧画面を再レンダリング
```

### 詳細表示フロー

```
TodoList（一覧）
  ├─> 詳細アイコンクリック
  ├─> navigate(`${NAVIGATION_PATH.DETAIL}${id}`)で詳細ページへ
  └─> TodoDetailTemplate
       ├─> useParams()でidを取得
       ├─> originalTodoListから該当Todoを検索
       └─> 読み取り専用フォームに表示
```

## 重要な設計原則

### 1. 単一責任の原則

- **useTodo**: 状態管理のみ
- **TodoContext**: 状態の配信のみ
- **useTodoContext**: Contextアクセスのみ
- **Template専用フック**: そのテンプレート固有のロジックのみ

### 2. 依存の方向

```
useTodo (独立)
  ↓
TodoContext (useTodoに依存)
  ↓
useTodoContext (TodoContextに依存)
  ↓
Templates (useTodoContextに依存)
  ↓
Template専用フック (ルーターとローカル状態のみ)
```

### 3. ローカル状態 vs グローバル状態

- **グローバル状態（Context）**: `originalTodoList`, CRUD操作
- **ローカル状態（Template専用フック）**: フォーム入力値、検索キーワード、ページ遷移処理

### 4. props のバケツリレー回避

Context APIを使用することで、中間コンポーネントを経由せず直接必要なコンポーネントで状態を取得。
