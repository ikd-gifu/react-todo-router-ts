import { useState, useMemo } from "react";
import { useTodoContext } from "../../../hooks/useTodoContext";

/**
 * TodoTemplateのページ固有UI状態管理
 * 検索機能など、表示・操作に関わる一時的な状態を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoTemplate = () => {
  const { originalTodoList, handleDeleteTodo } = useTodoContext();
  
  // 検索用のキーワードの状態管理 初期値を空文字に設定
  // useStateから返されるセッター関数は自動的にメモ化されている
  const [searchInputValue, setSearchInputValue] = useState("");

  // 検索用の入力値に基づいて表示するTodoリストを絞り込む
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      // 検索キーワードに前方一致したTodoだけを一覧表示
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
    // originalTodoListかsearchInputValueが変化したときに再計算
  }, [originalTodoList, searchInputValue]);

  return {
    searchInputValue,
    setSearchInputValue,
    showTodoList,
    handleDeleteTodo,
  };
};
