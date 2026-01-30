import { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";

// カスタムフックとしてContextを利用するためのラッパー関数を定義
// export const useTodoContext = () =>  useContext(TodoContext);
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  
  if (context === undefined) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }
  
  // undefinedでないので型はTodoContextValueTypeとして推論される
  return context;
};
