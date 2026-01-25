# react-todo-router-ts

**JavaScript → TypeScript 移行経験 + React Router v7** をアピールするプロジェクト

## プロジェクト構成

### 01-javascript-router
- Context APIによる状態管理
- React Router v7によるSPA実装
- Atomic Designによるコンポーネント設計
- JavaScript実装

### 02-typescript-migration
- `01-javascript-router`をTypeScript化
- 型安全性の向上
- 同一機能をTypeScriptで実装

## 使用技術

- **React**: 19.2.0
- **React Router**: v7.12.0
- **TypeScript**: 5.7.3 (02-typescript-migrationのみ)
- **Vite**: 7.2.4
- **Context API**: グローバル状態管理
- **CSS Modules**: スコープ付きスタイリング
- **Vitest**: テストフレームワーク

## 学習の流れ

1. **01-javascript-router**: Context API + React Router v7の基礎実装
2. **02-typescript-migration**: JavaScript → TypeScript 移行経験

## セットアップ

```bash
# 01-javascript-routerのセットアップ
cd 01-javascript-router
npm install
npm run dev

# 02-typescript-migrationのセットアップ
cd 02-typescript-migration
npm install
npm run dev
```

## プロジェクトの特徴

### Atomic Design
- **Atoms**: 最小単位のUI部品（InputForm、CommonButtonなど）
- **Molecules**: Atomsの組み合わせ（Navigationなど）
- **Organisms**: 複合コンポーネント（BaseLayout、TodoListなど）
- **Templates**: ページレイアウト + ビジネスロジック統合
- **Pages**: ルーティング単位のページ

### データフロー
```
useTodo (状態管理) 
  → TodoContext (Context API)
  → Templates (ページ実装)
  → Template専用フック (ビジネスロジック)
```

### 設計ドキュメント

各プロジェクトの `/docs` フォルダに詳細なドキュメントを配置:
- `01-ARCHITECTURE.md` - アーキテクチャ全体像
- `02-DATA-FLOW.md` - データフロー設計
- `03-ROUTING-STRATEGY.md` - ルーティング戦略
- `04-COMPONENT-PATTERNS.md` - コンポーネント設計パターン
- `05-IMPLEMENTATION-RULES.md` - 実装ルール
- `06-AI-INSTRUCTIONS.md` - AI実装指示書

## 実装機能

- Todo一覧表示
- Todo新規作成
- Todo編集
- Todo削除
- Todo詳細表示
- 検索機能（前方一致）
- ページ遷移（React Router v7）

## アピールポイント

1. **段階的な技術習得**: JavaScript → TypeScript
2. **設計パターン**: Atomic Design + Context API
3. **モダンな技術スタック**: React 19 + Router v7 + Vite 7
4. **ドキュメント整備**: 設計思想を体系化
5. **型安全性**: TypeScriptによる堅牢な実装
