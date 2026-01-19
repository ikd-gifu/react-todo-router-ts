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
  const {
    showTodoList, // 状態
    addInputValue,
    searchInputValue,
    handleDeleteTodo, // 関数
    handleAddTodo,
    onChangeAddInputValue,
    setSearchInputValue
  } = useTodo();

  return (
    // <TodoTemplate /> がレンダリングされる
    <TodoContext.Provider
      value={{
        showTodoList, // 状態
        addInputValue,
        searchInputValue,
        handleDeleteTodo, // 関数
        handleAddTodo,
        onChangeAddInputValue,
        setSearchInputValue
      }}>
        {children}
      </TodoContext.Provider>
  )
};
