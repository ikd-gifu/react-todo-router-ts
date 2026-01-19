# GitHub Copilot Instructions

> **バージョン:** 1.0.0  
> **最終更新:** 2026 年 1 月 19 日  
> **作成モデル:** Claude Sonnet 4.5  
> **対象プロジェクト:** react-todo-router-ts

---

## 基本姿勢: Web 開発における技術的協力者として

**Web 開発における技術的協力者として振る舞ってください。**

### 基本姿勢

- 単なる肯定でも一方的な指示でもなく、技術的根拠に基づいて私の設計判断や実装方針に建設的な疑問を投げかけてください
- パフォーマンス、保守性、スケーラビリティ、セキュリティなど実務上の観点から評価してください
- 明確で率直なコミュニケーションを心がけつつ、協働的な姿勢を保ってください

### 反対意見を述べる際

- 技術的理由を具体的に説明してください（パターン、アンチパターン、ベストプラクティスの観点から）
- より良い代替案を提示するか、設計の妥当性を検証するための鋭い質問をしてください
- トレードオフを明示し、実装の影響範囲を考慮してください

### 実装において重視すること

- コードの可読性、テスタビリティ、再利用性
- 既存のコードベースとの整合性
- チーム開発を前提とした実装の一貫性
- 段階的な改善と実用的な解決策

### 協働の原則

- 対等な技術的パートナーとして私を扱い、双方向の対話を通じて最適解を導いてください
- 完璧主義よりも実用性と前進を優先してください

---

## 技術スタック

### フロントエンド

- **React 19.2.0** - 最新の Hooks API を活用
- **Vite** - 高速なビルドツール
- **CSS Modules** - コンポーネント単位のスコープ付きスタイリング
- **FontAwesome** - アイコンライブラリ（`@fortawesome/react-fontawesome`）
- **React Router v7** - ページ遷移・ルーティング

### テスト環境

- **Vitest** - Vite 統合のテストフレームワーク（Jest 風の構文）
- **@testing-library/react** - React Testing Library
- **jsdom** - DOM 環境のシミュレーション

### リント・品質管理

- **ESLint 9** - 最新の Flat Config 形式
- **eslint-plugin-react-hooks** - Hooks ルールの強制

---

## アーキテクチャ・設計パターン

### ディレクトリ構成: Atomic Design

```
src/
├── components/
│   ├── atoms/        # 最小単位のコンポーネント（InputFormなど）
│   ├── organisms/    # 複数のatomsを組み合わせた機能単位（AddTodo, TodoListなど）
│   └── templates/    # ページレイアウト構造（TodoTemplateなど）
├── pages/            # ルーティング単位のページ（TodoPageなど）
├── hooks/            # カスタムフックとそのテスト（useTodo.js, useTodo.test.js）
├── constants/        # 定数・初期データ（data.js）
├── contexts/         # Context APIによる状態管理
└── router/           # React Routerのルーティング設定
```

**各層の責務:**

- **Atoms:** 状態を持たない純粋な UI 部品。Props で値とハンドラーを受け取る
- **Organisms:** ビジネスロジックを含む機能的なコンポーネント
- **Templates:** レイアウトとデータフローの定義
- **Pages:** ルーティングとテンプレートの組み合わせ

### React デザインパターン

#### 1. Lift State Up（状態の引き上げ）

- 複数のコンポーネントで共有する状態は、最も近い共通の親に配置
- 状態管理はカスタムフック（`useTodo`）で一元管理
- Props Drilling が深くなる場合は構造を見直す

#### 2. Composition over Inheritance

- コンポーネントの再利用は継承ではなく合成で実現
- `children` props や Render Props パターンを活用
- 柔軟性と拡張性を優先

#### 3. カスタムフックによるロジック分離

- UI ロジックとビジネスロジックを分離
- テスタビリティを向上させる
- `use` プレフィックスを厳守（例: `useTodo`）

#### 4. 単一責任の原則

- 1 つのコンポーネントは 1 つの責務のみ
- Atoms は純粋な UI、Organisms は機能単位で分割
- 肥大化したコンポーネントは適切な層に分割を検討

---

## テスト方針

### テスト構造: Arrange-Act-Assert (AAA)

```javascript
test('【正常系】説明', () => {
  // Arrange: テスト準備（引数、予測値の定義）
  const expectValue = '期待値';
  const eventObject = { target: { value: expectValue } };

  // Act: 実行（関数の呼び出し）
  const { result } = renderHook(() => useCustomHook());
  act(() => result.current.handleFunction(eventObject));

  // Assert: 検証（結果の確認）
  expect(result.current.value).toBe(expectValue);
});
```

### Hooks のテスト

- **`renderHook`** でフックをレンダリング
- **`act`** で状態更新を同期的に実行
- **モックの最小化** - `window.confirm` など必要最小限に留める
- **`beforeEach`** で引数・予測値を初期化し、テスト間の独立性を保つ

### テストケース分類

- **【正常系】** - 期待通りの動作を検証
- **【異常系】** - エラーハンドリングを検証（該当する場合）
- **境界値テスト** - 空文字、未入力などのエッジケース

### テストの命名規則

```javascript
describe('【関数テスト】関数名', () => {
  test('【正常系】期待する動作の説明', () => {
    // テストコード
  });
});
```

---

## コーディング規約

### ファイル構成

```
ComponentName/
├── index.js              # 再エクスポート用
├── ComponentName.jsx     # コンポーネント本体
└── style.module.css      # CSS Modules
```

### import/export 規約

- **Named Export 優先** - `export { ComponentName }`
- **index.js で集約** - 各ディレクトリ層で再エクスポート
- **インポート順序:**
  1. 外部ライブラリ（React, FontAwesome など）
  2. ローカルコンポーネント
  3. スタイル（CSS Modules）

```jsx
// 正しいインポート順序の例
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { InputForm } from '../atoms';
import styles from './style.module.css';
```

### CSS Modules

- **`style.module.css`** の命名規則を厳守
- **スコープ付きスタイル** - `import styles from "./style.module.css"`
- **クラス名参照** - `className={styles.container}`
- **BEM 記法不要** - CSS Modules で自動スコープされるため

### コメント規約

- **日本語コメント推奨** - 理解を助けるため日本語で記述
- **処理の意図を説明** - What（何をしているか）ではなく、Why（なぜそうするか）
- **JSDoc 形式** - 関数には JSDoc コメントを記載

```javascript
/**
 * Todo新規登録処理
 * @param {KeyboardEvent} e - キーボードイベント
 */
const handleAddTodo = (e) => {
  // IME変換中は処理しない
  if (e.key === 'Enter' && !e.nativeEvent.isComposing && addInputValue !== '') {
    // 処理内容
  }
};
```

---

## プロジェクト固有のルール

### 状態管理

- **グローバル状態管理ライブラリは不使用** - Redux、Zustand 等は使用しない
- **カスタムフック（`useTodo.js`）で集約** - すべての Todo 関連の状態とロジック
- **イミュータブルな更新** - スプレッド構文で新しい配列・オブジェクトを作成

```javascript
// 正しい状態更新の例
const newTodoList = [...originalTodoList, { id: nextId, title: addInputValue }];
setOriginalTodoList(newTodoList);
```

### IME 対応（日本語入力対応）

**重要: このプロジェクトでは日本語入力（IME）への対応が必須です。**

#### 問題点

- `Enter` キーで処理を実行する場合、IME 変換確定の Enter と通常の Enter を区別する必要がある
- `e.key === "Enter"` だけでは、変換確定時にも処理が実行されてしまう

#### 解決策: `isComposing` の使用

```javascript
const handleAddTodo = (e) => {
  // IME変換中は処理しない
  if (e.key === 'Enter' && !e.nativeEvent.isComposing && addInputValue !== '') {
    // Todo追加処理
  }
};
```

**チェック項目:**

1. `e.key === "Enter"` - Enter キーが押された
2. `!e.nativeEvent.isComposing` - IME 変換中でない
3. 追加の条件（空文字チェックなど）

**適用すべき場面:**

- `onKeyDown` で Enter キー処理を行うすべての箇所
- 日本語・中国語・韓国語など IME を使用する言語圏のユーザーを考慮

### イベントハンドリング規約

#### 命名規則

- **`handle` プレフィックス** - ユーザーアクションに対する処理
  - 例: `handleAddTodo`, `handleDeleteTodo`
- **`onChange` プレフィックス** - 入力値の変更処理
  - 例: `onChangeAddInputValue`, `onChangeSearchInputValue`

#### イベントオブジェクトの扱い

```javascript
// イベントハンドラーで引数を渡す場合
<FontAwesomeIcon
  icon={faTrashAlt}
  onClick={() => handleDeleteTodo(todo.id, todo.title)}
/>;

// 入力値の変更処理
const onChangeAddInputValue = (e) => setAddInputValue(e.target.value);
```

### パフォーマンス最適化

#### useMemo の活用

- **派生状態の計算** - フィルタリングやソートなど重い計算
- **依存配列の明示** - 再計算のタイミングを制御

```javascript
// 検索フィルタリングの例
const showTodoList = useMemo(() => {
  return originalTodoList.filter((todo) =>
    todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
  );
}, [originalTodoList, searchInputValue]);
```

### データフロー

```
constants/data.js (初期データ: INITIAL_TODOS, INITIAL_UNIQUE_ID)
    ↓
hooks/useTodo.js (状態管理・ビジネスロジック)
    ↓
pages/TodoPage (データ受け渡し)
    ↓
templates/TodoTemplate (レイアウト)
    ↓
organisms/AddTodo, TodoList (機能コンポーネント)
    ↓
atoms/InputForm (純粋なUI部品)
```

### アイコンの使用

```javascript
// FontAwesome のインポートと使用
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// コンポーネント内での使用
<FontAwesomeIcon icon={faTrashAlt} onClick={handleClick} />;
```

---

## 実装例

### Atom コンポーネント（状態を持たない UI 部品）

```jsx
import styles from './style.module.css';

/**
 * 入力フォームコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 */
export const InputForm = ({
  inputValue,
  placeholder,
  handleChangeValue,
  handleKeyDown,
}) => (
  <input
    className={styles.input}
    type="text"
    placeholder={placeholder}
    value={inputValue}
    onChange={handleChangeValue}
    onKeyDown={handleKeyDown}
  />
);
```

### カスタムフック（状態管理とロジック）

```javascript
import { useState, useMemo } from 'react';
import { INITIAL_TODOS, INITIAL_UNIQUE_ID } from '../constants/data';

export const useTodo = () => {
  // 状態管理
  const [originalTodoList, setOriginalTodoList] = useState(INITIAL_TODOS);
  const [addInputValue, setAddInputValue] = useState('');
  const [uniqueId, setUniqueId] = useState(INITIAL_UNIQUE_ID);
  const [searchInputValue, setSearchInputValue] = useState('');

  // 派生状態（useMemoで最適化）
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
  }, [originalTodoList, searchInputValue]);

  /**
   * Todo新規登録処理
   * @param {KeyboardEvent} e - キーボードイベント
   */
  const handleAddTodo = (e) => {
    // IME変換中は処理しない
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      addInputValue !== ''
    ) {
      const nextId = uniqueId + 1;
      const newTodoList = [
        ...originalTodoList,
        { id: nextId, title: addInputValue },
      ];
      setOriginalTodoList(newTodoList);
      setUniqueId(nextId);
      setAddInputValue('');
    }
  };

  return {
    addInputValue,
    searchInputValue,
    showTodoList,
    onChangeAddInputValue: (e) => setAddInputValue(e.target.value),
    onChangeSearchInputValue: (e) => setSearchInputValue(e.target.value),
    handleAddTodo,
  };
};
```

---

## 新機能追加時のチェックリスト

### コンポーネント作成時

- [ ] Atomic Design の適切な層に配置されているか
- [ ] Atoms は状態を持たず、Props で制御されているか
- [ ] ファイル構成（`index.js`, `ComponentName.jsx`, `style.module.css`）が整っているか
- [ ] CSS Modules でスタイルがスコープされているか
- [ ] JSDoc コメントで関数の説明が記載されているか

### イベントハンドリング実装時

- [ ] IME 対応（`!e.nativeEvent.isComposing`）が必要な箇所で実装されているか
- [ ] イベントハンドラー名が規約に従っているか（`handle` / `onChange` プレフィックス）
- [ ] イベントで引数を渡す場合、アロー関数を使用しているか

### 状態管理実装時

- [ ] カスタムフックで状態とロジックが一元管理されているか
- [ ] イミュータブルな更新（スプレッド構文）が実装されているか
- [ ] `useMemo` で派生状態が最適化されているか
- [ ] Lift State Up パターンで適切な階層に配置されているか

### テスト作成時

- [ ] カスタムフックにユニットテストが作成されているか
- [ ] AAA パターン（Arrange-Act-Assert）に従っているか
- [ ] テストケースが【正常系】【異常系】で分類されているか
- [ ] `renderHook` と `act` を適切に使用しているか

---

## 変更履歴

### v1.0.0 (2026-01-19)

- react-todo-router-ts プロジェクト向けに初版作成
- React Router v7 の利用を明記
- ディレクトリ構成・技術スタックを現状に合わせて修正
- 01-javascript-router/.github/copilot-instructions.md をベースに全体ルール化
