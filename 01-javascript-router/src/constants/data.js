// Todoリストの初期データ
export const INITIAL_TODOS = [
  {
    id: 1,
    title: "ReactでTodoアプリを作成する",
  },
  {
    id: 2,
    title: "CSS Modulesを理解する",
  },
  {
    id: 3,
    title: "コンポーネント設計を学ぶ",
  },
  {
    id: 4,
    title: "状態管理を実装する",
  }
];

// 新規作成時の重複しないIDの初期値
export const INITIAL_UNIQUE_ID = INITIAL_TODOS.length;
