# 02-typescript-migration

**JavaScript → TypeScript移行版** Todoアプリケーション

## 概要

`01-javascript-router`をTypeScript化したプロジェクトです。
React Router v7 + Context API + TypeScriptによる型安全な実装を実現しています。

## 使用技術

- **React**: 19.2.0
- **React Router**: v7.12.0
- **TypeScript**: 5.7.3
- **Vite**: 7.2.4
- **Vitest**: 4.0.16
- **ESLint**: 9.39.1 (Flat Config)
- **CSS Modules**: スコープ付きスタイリング

## アーキテクチャ

- **Atomic Design**: コンポーネント設計
- **Context API**: グローバル状態管理
- **Template専用フック**: ビジネスロジック分離
- **React Router v7**: ページ遷移・ルーティング

詳細は `/docs` フォルダ内のドキュメントを参照してください。

## セットアップ

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### テスト実行

```bash
npm run test
```

### Lint実行

```bash
npm run lint
```

## ドキュメント

プロジェクト設計の詳細は以下を参照:

- [01-ARCHITECTURE.md](./docs/01-ARCHITECTURE.md) - アーキテクチャ全体像
- [02-DATA-FLOW.md](./docs/02-DATA-FLOW.md) - データフロー設計
- [03-ROUTING-STRATEGY.md](./docs/03-ROUTING-STRATEGY.md) - ルーティング戦略
- [04-COMPONENT-PATTERNS.md](./docs/04-COMPONENT-PATTERNS.md) - コンポーネント設計パターン
- [05-IMPLEMENTATION-RULES.md](./docs/05-IMPLEMENTATION-RULES.md) - 実装ルール
- [06-AI-INSTRUCTIONS.md](./docs/06-AI-INSTRUCTIONS.md) - AI実装指示書

## プロジェクト構造

```
src/
├── components/        # Atomic Designによるコンポーネント
│   ├── atoms/        # 最小単位のUI部品
│   ├── molecules/    # Atomsの組み合わせ
│   ├── organisms/    # 複合コンポーネント
│   └── templates/    # ページレイアウト + ロジック統合
├── pages/            # ルーティング単位のページ
├── hooks/            # カスタムフック
├── contexts/         # Context API
├── constants/        # 定数・初期データ
├── types/            # TypeScript型定義
└── router/           # React Routerのルーティング設定
```

## 主な機能

- Todo一覧表示
- Todo新規作成
- Todo編集
- Todo削除
- Todo詳細表示
- 検索機能（前方一致）

## 01-javascript-routerとの違い

- TypeScript化による型安全性の向上
- `.jsx` → `.tsx` ファイル拡張子変更
- `types/` フォルダ追加（型定義の一元管理）
- Props、State、関数の型定義追加
