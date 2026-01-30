# AI実装指示書

このドキュメントは、AIエージェント（Claude Code等）がこのプロジェクトのコードを実装する際の**絶対的なルール**です。

## AIの役割

あなたは**実装者**です。監督（人間）の指示に従い、このドキュメントの通りにコードを書きます。
**独自の判断で設計を変更してはいけません。**

## 実装前の必須手順

1. **全ドキュメントを読み込む**
   - `/docs/01-ARCHITECTURE.md`
   - `/docs/02-DATA-FLOW.md`
   - `/docs/03-ROUTING-STRATEGY.md`
   - `/docs/04-COMPONENT-PATTERNS.md`
   - `/docs/05-IMPLEMENTATION-RULES.md`
   - `/docs/06-AI-INSTRUCTIONS.md`（本ファイル）

2. **要件を確認する**
   - 人間からの指示内容を正確に理解
   - 不明点があれば**実装前に質問**

3. **既存コードを確認する**
   - 同じパターンの既存実装を参照
   - コピー&修正で一貫性を保つ

## 実装パターン集

### パターン1: 新規ページ追加（CRUD画面）

#### ステップ1: 定数定義

```typescript
// src/constants/navigation.ts に追加
export const NAVIGATION_LIST = {
  // 既存...
  NEW_PAGE: `${BASE_PATH}/new-page/:id`, // パラメータが必要な場合
};

export const NAVIGATION_PATH = {
  // 既存...
  NEW_PAGE: `${BASE_PATH}/new-page/`, // 遷移用
};
```

#### ステップ2: Page作成

```typescript
// src/pages/NewPage/index.ts
export { NewPage } from "./NewPage";

// src/pages/NewPage/NewPage.tsx
import { NewTemplate } from "../../components/templates";

export const NewPage = () => <NewTemplate />;
```

#### ステップ3: Template作成

```typescript
// src/components/templates/NewTemplate/index.ts
export { NewTemplate } from "./NewTemplate";

// src/components/templates/NewTemplate/NewTemplate.tsx
import { useTodoContext } from "../../../hooks/useTodoContext";
import { BaseLayout } from "../../organisms";
import { InputForm, CommonButton } from "../../atoms";
import { useNewTemplate } from "./useNewTemplate";
import styles from "./style.module.css";

export const NewTemplate = () => {
  const { originalTodoList, someCrudAction } = useTodoContext();
  const {
    // 必要な状態とハンドラ
  } = useNewTemplate({ originalTodoList, someCrudAction });

  return <BaseLayout title={"Page Title"}>{/* レイアウト実装 */}</BaseLayout>;
};
```

#### ステップ4: Template専用フック作成

```typescript
// src/components/templates/NewTemplate/useNewTemplate.ts
import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { TodoType } from "../../../types/Todo";

type UseNewTemplateParams = {
  originalTodoList: Array<TodoType>;
  someCrudAction: (value: string) => void;
};

export const useNewTemplate = ({
  originalTodoList,
  someCrudAction,
}: UseNewTemplateParams) => {
  const navigate = useNavigate();
  const { id } = useParams(); // 必要な場合

  // ローカル状態
  const [inputValue, setInputValue] = useState<string>("");

  // イベントハンドラ
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    [],
  );

  const handleSubmit = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue !== "") {
        someCrudAction(inputValue);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [someCrudAction, inputValue, navigate],
  );

  return {
    inputValue,
    handleChange,
    handleSubmit,
  };
};
```

#### ステップ5: Router追加

```typescript
// src/router/TodoRouter.tsx に追加
import { NewPage } from "../pages";

<Route path={NAVIGATION_LIST.NEW_PAGE} element={<NewPage />} />;
```

#### ステップ6: pages/index.ts 更新

```typescript
// src/pages/index.ts
export { NewPage } from "./NewPage";
```

### パターン2: 新規Atom追加

#### ファイル構造

```
src/components/atoms/NewAtom/
  ├── index.ts
  ├── NewAtom.tsx
  └── style.module.css
```

#### 実装

```typescript
// src/components/atoms/NewAtom/index.ts
export { NewAtom } from "./NewAtom";

// src/components/atoms/NewAtom/NewAtom.tsx
import { FC, ChangeEvent } from "react";
import styles from "./style.module.css";

type NewAtomProps = {
  prop1: string;
  prop2: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const NewAtom: FC<NewAtomProps> = ({ prop1, prop2, onChange }) => (
  <div className={styles.container}>{/* 実装 */}</div>
);
```

#### atoms/index.ts 更新

```typescript
// src/components/atoms/index.ts
export { NewAtom } from "./NewAtom";
```

### パターン3: Context に新しいアクション追加

#### ステップ1: useTodo にロジック追加

```typescript
// src/hooks/useTodo.ts
const newAction = useCallback(
  (param1: string, param2: number) => {
    // ロジック実装
    const updatedList = originalTodoList.map(/* ... */);
    setOriginalTodoList(updatedList);
  },
  [originalTodoList],
);

return {
  originalTodoList,
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  newAction, // 追加
};
```

#### ステップ2: TodoContext で提供

```typescript
// src/contexts/TodoContext.tsx
const { originalTodoList, handleCreateTodo, handleUpdateTodo, handleDeleteTodo, newAction } =
  useTodo();

return (
  <TodoContext.Provider
    value={{
      originalTodoList,
      handleCreateTodo,
      handleUpdateTodo,
      handleDeleteTodo,
      newAction, // 追加
    }}
  >
    {children}
  </TodoContext.Provider>
);
```

## 実装時の絶対ルール

### ❌ 禁止事項

1. **設計の変更**
   - Atomic Designの階層を無視しない
   - Context APIを使わず新しい状態管理ライブラリを導入しない
   - ファイル構造を勝手に変更しない

2. **命名の逸脱**
   - 既存の命名規則を無視しない
   - 独自の接頭辞・接尾辞を追加しない

3. **パターンの混在**
   - 異なるスタイリング手法（CSS Modules以外）を使わない
   - Exportパターンを混在させない

4. **最適化の省略**
   - `useCallback` / `useMemo` を使わずにイベントハンドラを定義しない
   - 依存配列を省略しない

### ✅ 必須事項

1. **既存コードを参照**
   - 同じ種類のコンポーネントを探してコピー
   - パターンを守って修正

2. **ドキュメント通りに実装**
   - `/docs/` の記載を最優先
   - 既存コードとドキュメントが矛盾する場合は**人間に確認**

3. **段階的な実装**
   - 一度に全部作らない
   - 1ファイルずつ作成し、動作確認しながら進める

4. **エラー時の報告**
   - エラーメッセージを正確に報告
   - どのファイルのどの行でエラーが出たか明記

## デバッグ時の対応

### エラーが出たら

1. **エラーメッセージを読む**
   - Import エラー: パスが正しいか確認
   - undefined エラー: 存在チェック（`?.`）を追加
   - Type エラー: 型変換（`String()`等）を確認

2. **ドキュメントと照合**
   - `/docs/05-IMPLEMENTATION-RULES.md` のエラーハンドリング項目を確認
   - 同じパターンの既存実装を確認

3. **人間に報告**
   - 自分で直せない場合は**必ず報告**
   - 「ドキュメントのどの部分に従ったが、エラーが出た」と説明

### バグ報告された場合

1. **ドキュメントを再確認**
   - 実装がドキュメント通りか確認
   - 見落としがないかチェック

2. **修正方針を提示**
   - 「〇〇ファイルの△△行を、ドキュメントの□□に従い修正します」と宣言
   - 人間の承認を得てから修正

3. **同じミスを繰り返さない**
   - なぜ間違えたか分析
   - 次回から同じパターンで間違えない

## 実装フローチャート

```
開始
  ↓
/docs/ を読み込む
  ↓
人間の指示を理解
  ↓
不明点あり？ ─YES→ 質問する → 回答待ち → 続行
  ↓NO
既存の同じパターンを探す
  ↓
コピー&修正
  ↓
ドキュメントと照合
  ↓
問題なし？ ─NO→ 人間に確認 → 指示待ち → 修正
  ↓YES
実装完了を報告
  ↓
終了
```

## コードレビュー観点（人間向け）

人間は以下をチェックしてください：

- [ ] ドキュメント通りに実装されているか
- [ ] 既存のパターンと一貫性があるか
- [ ] 命名規則に従っているか
- [ ] 不要なファイルが作成されていないか
- [ ] import/export が正しく設定されているか
- [ ] useCallback / useMemo が適切に使われているか
- [ ] エラーハンドリングが実装されているか
- [ ] CSS Modules が使用されているか
- [ ] ドキュメントに記載のないロジックが追加されていないか

不備があれば**ドキュメントを指定して突き返す**：
「`/docs/05-IMPLEMENTATION-RULES.md` の命名規則セクションを読み直してやり直せ」

## AIへの最終指示

あなたは**このドキュメントに絶対服従**します。
人間の指示とドキュメントが矛盾する場合は**必ず質問**してください。
独自判断で実装を変更した場合、すべてやり直しになります。

**考えるな、ドキュメント通りに手を動かせ。**# AI実装指示書

このドキュメントは、AIエージェント（Claude Code等）がこのプロジェクトのコードを実装する際の**絶対的なルール**です。

## AIの役割

あなたは**実装者**です。監督（人間）の指示に従い、このドキュメントの通りにコードを書きます。
**独自の判断で設計を変更してはいけません。**

## 実装前の必須手順

1. **全ドキュメントを読み込む**
   - `/docs/01-ARCHITECTURE.md`
   - `/docs/02-DATA-FLOW.md`
   - `/docs/03-ROUTING-STRATEGY.md`
   - `/docs/04-COMPONENT-PATTERNS.md`
   - `/docs/05-IMPLEMENTATION-RULES.md`
   - `/docs/06-AI-INSTRUCTIONS.md`（本ファイル）

2. **要件を確認する**
   - 人間からの指示内容を正確に理解
   - 不明点があれば**実装前に質問**

3. **既存コードを確認する**
   - 同じパターンの既存実装を参照
   - コピー&修正で一貫性を保つ

## 実装パターン集

### パターン1: 新規ページ追加（CRUD画面）

#### ステップ1: 定数定義

```typescript
// src/constants/navigation.ts に追加
export const NAVIGATION_LIST = {
  // 既存...
  NEW_PAGE: `${BASE_PATH}/new-page/:id`, // パラメータが必要な場合
};

export const NAVIGATION_PATH = {
  // 既存...
  NEW_PAGE: `${BASE_PATH}/new-page/`, // 遷移用
};
```

#### ステップ2: Page作成

```typescript
// src/pages/NewPage/index.ts
export { NewPage } from "./NewPage";

// src/pages/NewPage/NewPage.tsx
import { NewTemplate } from "../../components/templates";

export const NewPage = () => <NewTemplate />;
```

#### ステップ3: Template作成

```typescript
// src/components/templates/NewTemplate/index.ts
export { NewTemplate } from "./NewTemplate";

// src/components/templates/NewTemplate/NewTemplate.tsx
import { useTodoContext } from "../../../hooks/useTodoContext";
import { BaseLayout } from "../../organisms";
import { InputForm, CommonButton } from "../../atoms";
import { useNewTemplate } from "./useNewTemplate";
import styles from "./style.module.css";

export const NewTemplate = () => {
  const { originalTodoList, someCrudAction } = useTodoContext();
  const {
    // 必要な状態とハンドラ
  } = useNewTemplate({ originalTodoList, someCrudAction });

  return <BaseLayout title={"Page Title"}>{/* レイアウト実装 */}</BaseLayout>;
};
```

#### ステップ4: Template専用フック作成

```typescript
// src/components/templates/NewTemplate/useNewTemplate.ts
import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { TodoType } from "../../../types/Todo";

type UseNewTemplateParams = {
  originalTodoList: Array<TodoType>;
  someCrudAction: (value: string) => void;
};

export const useNewTemplate = ({
  originalTodoList,
  someCrudAction,
}: UseNewTemplateParams) => {
  const navigate = useNavigate();
  const { id } = useParams(); // 必要な場合

  // ローカル状態
  const [inputValue, setInputValue] = useState<string>('');

  // イベントハンドラ
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    [],
  );

  const handleSubmit = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue !== '') {
        someCrudAction(inputValue);
        navigate(NAVIGATION_PATH.TOP);
      }
    },
    [someCrudAction, inputValue, navigate],
  );

  return {
    inputValue,
    handleChange,
    handleSubmit,
  };
};
```

#### ステップ5: Router追加

```typescript
// src/router/TodoRouter.tsx に追加
import { NewPage } from "../pages";

<Route path={NAVIGATION_LIST.NEW_PAGE} element={<NewPage />} />;
```

#### ステップ6: pages/index.ts 更新

```typescript
// src/pages/index.ts
export { NewPage } from './NewPage';
```

### パターン2: 新規Atom追加

#### ファイル構造

```
src/components/atoms/NewAtom/
  ├── index.ts
  ├── NewAtom.tsx
  └── style.module.css
```

#### 実装

```typescript
// src/components/atoms/NewAtom/index.ts
export { NewAtom } from "./NewAtom";

// src/components/atoms/NewAtom/NewAtom.tsx
import { FC, ChangeEvent } from "react";
import styles from "./style.module.css";

type NewAtomProps = {
  prop1: string;
  prop2: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const NewAtom: FC<NewAtomProps> = ({ prop1, prop2, onChange }) => (
  <div className={styles.container}>{/* 実装 */}</div>
);
```

#### atoms/index.ts 更新

```typescript
// src/components/atoms/index.ts
export { NewAtom } from "./NewAtom";
```

### パターン3: Context に新しいアクション追加

#### ステップ1: useTodo にロジック追加

```typescript
// src/hooks/useTodo.ts
const newAction = useCallback(
  (param1: string, param2: number) => {
    // ロジック実装
    const updatedList = originalTodoList.map(/* ... */);
    setOriginalTodoList(updatedList);
  },
  [originalTodoList],
);

return {
  originalTodoList,
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  newAction, // 追加
};
```

#### ステップ2: TodoContext で提供

```typescript
// src/contexts/TodoContext.tsx
const { originalTodoList, handleCreateTodo, handleUpdateTodo, handleDeleteTodo, newAction } =
  useTodo();

return (
  <TodoContext.Provider
    value={{
      originalTodoList,
      handleCreateTodo,
      handleUpdateTodo,
      handleDeleteTodo,
      newAction, // 追加
    }}
  >
    {children}
  </TodoContext.Provider>
);
```

## 実装時の絶対ルール

### ❌ 禁止事項

1. **設計の変更**
   - Atomic Designの階層を無視しない
   - Context APIを使わず新しい状態管理ライブラリを導入しない
   - ファイル構造を勝手に変更しない

2. **命名の逸脱**
   - 既存の命名規則を無視しない
   - 独自の接頭辞・接尾辞を追加しない

3. **パターンの混在**
   - 異なるスタイリング手法（CSS Modules以外）を使わない
   - Exportパターンを混在させない

4. **最適化の省略**
   - `useCallback` / `useMemo` を使わずにイベントハンドラを定義しない
   - 依存配列を省略しない

### ✅ 必須事項

1. **既存コードを参照**
   - 同じ種類のコンポーネントを探してコピー
   - パターンを守って修正

2. **ドキュメント通りに実装**
   - `/docs/` の記載を最優先
   - 既存コードとドキュメントが矛盾する場合は**人間に確認**

3. **段階的な実装**
   - 一度に全部作らない
   - 1ファイルずつ作成し、動作確認しながら進める

4. **エラー時の報告**
   - エラーメッセージを正確に報告
   - どのファイルのどの行でエラーが出たか明記

## デバッグ時の対応

### エラーが出たら

1. **エラーメッセージを読む**
   - Import エラー: パスが正しいか確認
   - undefined エラー: 存在チェック（`?.`）を追加
   - Type エラー: 型変換（`String()`等）を確認

2. **ドキュメントと照合**
   - `/docs/05-IMPLEMENTATION-RULES.md` のエラーハンドリング項目を確認
   - 同じパターンの既存実装を確認

3. **人間に報告**
   - 自分で直せない場合は**必ず報告**
   - 「ドキュメントのどの部分に従ったが、エラーが出た」と説明

### バグ報告された場合

1. **ドキュメントを再確認**
   - 実装がドキュメント通りか確認
   - 見落としがないかチェック

2. **修正方針を提示**
   - 「〇〇ファイルの△△行を、ドキュメントの□□に従い修正します」と宣言
   - 人間の承認を得てから修正

3. **同じミスを繰り返さない**
   - なぜ間違えたか分析
   - 次回から同じパターンで間違えない

## 実装フローチャート

```
開始
  ↓
/docs/ を読み込む
  ↓
人間の指示を理解
  ↓
不明点あり？ ─YES→ 質問する → 回答待ち → 続行
  ↓NO
既存の同じパターンを探す
  ↓
コピー&修正
  ↓
ドキュメントと照合
  ↓
問題なし？ ─NO→ 人間に確認 → 指示待ち → 修正
  ↓YES
実装完了を報告
  ↓
終了
```

## コードレビュー観点（人間向け）

人間は以下をチェックしてください：

- [ ] ドキュメント通りに実装されているか
- [ ] 既存のパターンと一貫性があるか
- [ ] 命名規則に従っているか
- [ ] 不要なファイルが作成されていないか
- [ ] import/export が正しく設定されているか
- [ ] useCallback / useMemo が適切に使われているか
- [ ] エラーハンドリングが実装されているか
- [ ] CSS Modules が使用されているか
- [ ] ドキュメントに記載のないロジックが追加されていないか

不備があれば**ドキュメントを指定して突き返す**：
「`/docs/05-IMPLEMENTATION-RULES.md` の命名規則セクションを読み直してやり直せ」

## AIへの最終指示

あなたは**このドキュメントに絶対服従**します。
人間の指示とドキュメントが矛盾する場合は**必ず質問**してください。
独自判断で実装を変更した場合、すべてやり直しになります。

**考えるな、ドキュメント通りに手を動かせ。**
