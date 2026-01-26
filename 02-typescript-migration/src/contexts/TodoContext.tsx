import { createContext, ReactNode, FC } from "react";
import { useTodo } from "../hooks/useTodo";
import { TodoType } from "../types/Todo";

type TodoContextValueType = {
  originalTodoList: Array<TodoType>;
  // 関数の型シグネチャ 引数を受け取るが、戻り値は使わない
  handleCreateTodo: (title: string, content: string) => void;
  handleDeleteTodo: (targetId: number, targetTitle: string) => void;
  handleUpdateTodo: (targetId: number, title: string, content: string) => void;
};

// 使う側でundefinedチェックが必要
// → カスタムフックで解決
const TodoContext = createContext<TodoContextValueType | undefined>(undefined);;

// TodoContextをエクスポート（これのみ公開）
export { TodoContext };

type TodoProviderProps = {
  children: ReactNode;
};

// childrenは<TodoTemplate />の中身
/**
 * Todo管理のContextプロバイダー
 * 配下のコンポーネントでuseTodoContext()を使ってアクセス可能
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - ラップするコンポーネント
 */
// Reactコンポーネントの明示性を高めるためにFCを使用
export const TodoProvider: FC<TodoProviderProps> = ({ children }) => {
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
