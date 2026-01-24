import { createContext } from "react";
import { useTodo } from "../hooks/useTodo";

// contextを作成する
// 空のオブジェクトで初期化
const TodoContext = createContext({});

// TodoContextをエクスポート（これのみ公開）
export { TodoContext };

// childrenは<TodoTemplate />の中身
/**
 * Todo管理のContextプロバイダー
 * 配下のコンポーネントでuseTodoContext()を使ってアクセス可能
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - ラップするコンポーネント
 */
export const TodoProvider = ({ children }) => {
  // カスタムフックから状態と関数を取得し、Contextで提供する
  // リファクタリング後: CRUD操作のみを提供
  const {
    originalTodoList, // データソース
    handleCreateTodo, // 新規作成関数
    handleDeleteTodo, // 削除関数
    handleUpdateTodo, // 更新関数
  } = useTodo();

  return (
    // <TodoTemplate /> がレンダリングされる
    <TodoContext.Provider
      value={{
        originalTodoList, // データソース
        handleCreateTodo, // 新規作成関数
        handleDeleteTodo, // 削除関数
        handleUpdateTodo, // 更新関数
      }}>
        {/*  このProviderでラップされた子コンポーネント全体 <Router /> */}
        {children}
      </TodoContext.Provider>
  )
};
