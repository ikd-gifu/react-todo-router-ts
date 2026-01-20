# アーキテクチャ概要

## プロジェクトの目的

React Router v7 と Context API を使用したモダンなTodoアプリケーション。
Atomic Designパターンに基づいたコンポーネント設計により、保守性と拡張性を確保。

## 技術スタック

- **React**: 19.2.0
- **React Router**: 7.12.0（react-router パッケージを使用）
- **Vite**: 7.2.4（ビルドツール）
- **CSS Modules**: コンポーネントスコープのスタイリング
- **Font Awesome**: @fortawesome/react-fontawesome 3.1.1, @fortawesome/free-solid-svg-icons 7.1.0

## ディレクトリ構造の原則

```
src/
├── main.jsx                    # アプリケーションエントリーポイント
├── router/                     # ルーティング定義
├── pages/                      # ページコンポーネント（薄いラッパー）
├── components/                 # Atomic Design構造
│   ├── atoms/                  # 最小単位のUI部品
│   ├── molecules/              # atoms の組み合わせ
│   ├── organisms/              # molecules + atoms の組み合わせ
│   └── templates/              # ページレイアウト + ビジネスロジック
├── contexts/                   # Context API によるグローバル状態管理
├── hooks/                      # カスタムフック
└── constants/                  # 定数定義
```

## レイヤー責務の分離

### 1. main.jsx（エントリーポイント）

- Providerの配置
- Routerのマウント
- グローバルスタイルの読み込み

### 2. contexts/（状態管理層）

- Context定義とProvider作成
- カスタムフックからロジックを受け取り、配下のコンポーネントに提供

### 3. hooks/（ビジネスロジック層）

- 状態管理とロジックの実装
- Contextに依存しない純粋なロジック

### 4. pages/（ルーティング層）

- Templateコンポーネントをラップするだけの薄い層
- ルーティングとコンポーネントのマッピング

### 5. components/templates/（プレゼンテーション + ロジック統合層）

- Contextから必要な状態とアクションを取得
- 専用カスタムフックでローカル状態とイベントハンドラを管理
- organisms, molecules, atoms を組み合わせてページレイアウトを構築

### 6. components/organisms/（複合コンポーネント層）

- molecules と atoms を組み合わせた大きな機能単位
- 再利用可能な複合コンポーネント

### 7. components/molecules/（中間コンポーネント層）

- atoms を組み合わせた小さな機能単位

### 8. components/atoms/（基礎UI層）

- 最小単位のUIコンポーネント
- 高い再利用性を持つ

### 9. router/（ルーティング設定層）

- React Routerの設定
- パスとページコンポーネントのマッピング

### 10. constants/（定数定義層）

- ルーティングパス定義
- 初期データ定義
