# react-todo-router-ts

**JavaScript → TypeScript 移行経験 + React Router** をアピールするプロジェクト

## プロジェクト構成

### 01-javascript-router
- ベース: `react-todo-state-management` の `02-context-api`
- 追加機能: React Router v6
- Context APIによる状態管理を継承

### 02-typescript-migration
- ベース: `01-javascript-router`
- TypeScript化
- react-hook-form + zod 統合

## 学習の流れ

1. **01-javascript-router**: Context API + Router実装
2. **02-typescript-migration**: JavaScript → TypeScript 移行

## セットアップ

```bash
# 01-javascript-routerのセットアップ
cd 01-javascript-router
npm install
npm run dev

## 使用技術
React 19.2.0
React Router v6
Context API
Vite
TypeScript (02-typescript-migrationのみ)
