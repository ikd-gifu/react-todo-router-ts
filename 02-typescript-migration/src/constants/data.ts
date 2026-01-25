import { Todo } from "../types/Todo";

// Todoリストの初期データ
export const INITIAL_TODOS: Array<Todo> = [
  {
    id: 1,
    title: "ReactでTodoアプリを作成する",
    content: "React Router v7を使って画面遷移を実装する",
  },
  {
    id: 2,
    title: "CSS Modulesを理解する",
    content: "スコープ付きスタイリングの仕組みを学ぶ",
  },
  {
    id: 3,
    title: "コンポーネント設計を学ぶ",
    content: "Atomic Designパターンを実践する",
  },
  {
    id: 4,
    title: "状態管理を実装する",
    content: "Context APIとカスタムフックで状態管理",
  }
];

// 新規作成時の重複しないIDの初期値
export const INITIAL_UNIQUE_ID = INITIAL_TODOS.length;
