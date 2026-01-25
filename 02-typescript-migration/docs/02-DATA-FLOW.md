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

**場所**: `src/hooks/useTodo.js`

**責務**:

- `originalTodoList`: Todo配列の状態管理
- `uniqueId`: Todo採番用ID管理
- `addTodo`: Todo追加ロジック
- `updateTodo`: Todo更新ロジック
- `deleteTodo`: Todo削除ロジック

**重要**: このフックはContextに依存しない。純粋なビジネスロジックとして独立。

### 2. Contextへの接続（TodoContext）

**場所**: `src/contexts/TodoContext.jsx`

**責務**:

- `useTodo`から状態とアクションを受け取る
- `TodoProvider`でラップした配下のコンポーネントに提供
- Context定義の`TodoContext`をエクスポート（useTodoContextで使用）

**提供する値**:

```javascript
{
  (originalTodoList, // Todo配列
    addTodo, // 追加関数
    updateTodo, // 更新関数
    deleteTodo); // 削除関数
}
```

### 3. Contextの利用（useTodoContext）

**場所**: `src/hooks/useTodoContext.js`

**責務**:

- `TodoContext`からコンテキスト値を取得するヘルパーフック
- テンプレートコンポーネントで使用

**使い方**:

```javascript
const { originalTodoList, addTodo, updateTodo, deleteTodo } = useTodoContext();
```

### 4. テンプレートでの状態利用

**場所**: `src/components/templates/*/`

各テンプレートは以下のパターンで実装:

#### パターン1: 一覧表示（TodoListTemplate）

```javascript
// 1. Contextから状態取得
const { originalTodoList, deleteTodo } = useTodoContext();

// 2. Template専用フックで表示ロジック管理
const { searchKeyword, showTodoList, handleChangeSearchKeyword } =
  useTodoListTemplate({ originalTodoList });

// 3. 子コンポーネントに渡す
<TodoList todoList={showTodoList} handleDeleteTodo={deleteTodo} />;
```

#### パターン2: 新規作成（TodoCreateTemplate）

```javascript
// 1. Contextからアクション取得
const { addTodo } = useTodoContext();

// 2. Template専用フックでフォーム状態管理
const {
  inputTitle,
  inputContent,
  handleChangeTitle,
  handleChangeContent,
  handleCreateTodo,
} = useTodoCreateTemplate({ addTodo });

// 3. フォームコンポーネントに渡す
<InputForm value={inputTitle} onChange={handleChangeTitle} />;
```

#### パターン3: 編集（TodoEditTemplate）

```javascript
// 1. Contextから状態とアクション取得
const { originalTodoList, updateTodo } = useTodoContext();

// 2. Template専用フックで編集対象取得 + フォーム管理
const {
  todo,
  inputTitle,
  inputContent,
  handleChangeTitle,
  handleChangeContent,
  handleUpdateTodo,
} = useTodoEditTemplate({ originalTodoList, updateTodo });

// 3. フォームコンポーネントに渡す
```

#### パターン4: 詳細表示（TodoDetailTemplate）

```javascript
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
  ├─> addTodo（Context経由）実行
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
       ├─> updateTodo（Context経由）実行
       ├─> originalTodoList更新
       └─> navigate(NAVIGATION_PATH.TOP)でトップへ遷移
```

### 削除フロー

```
TodoList（一覧）
  ├─> 削除アイコンクリック
  ├─> handleDeleteTodo（props経由）実行
  ├─> deleteTodo（Context経由）実行
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
