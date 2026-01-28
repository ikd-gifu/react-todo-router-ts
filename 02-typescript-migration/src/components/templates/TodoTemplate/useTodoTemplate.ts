import { useState, useMemo, useCallback } from "react";
import { useTodoContext } from "../../../hooks/useTodoContext";
// import { TodoType } from "../../../types/Todo"; --- 型推論が機能しているため不要

// type UseTodoTemplateParams = {
//   originalTodoList: Array<TodoType>;
// }
/**
 * TodoTemplateのページ固有UI状態管理
 * 検索機能など、表示・操作に関わる一時的な状態を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoTemplate = () => {
  // 型推論が機能: originalTodoListがArray<TodoType>と正しく推論される
  const { originalTodoList, handleDeleteTodo } = useTodoContext();
  
  // 検索用のキーワードの状態管理（初期値は空文字）
  const [searchInputValue, setSearchInputValue] = useState("");

  /**
   * 検索キーワード更新処理
   * @param {Event} e - 入力イベント
   */
  const onChangeSearchInputValue = useCallback(
    (e) => setSearchInputValue(e.target.value),
    []
  );

  // 検索キーワードに基づいて表示するTodoリストを絞り込む
  // useMemoで派生状態を最適化
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      // 検索キーワードに前方一致したTodoだけを一覧表示
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
    // originalTodoListかsearchInputValueが変化したときに再計算
  }, [originalTodoList, searchInputValue]);

  return {
    searchInputValue,
    showTodoList,
    handleDeleteTodo,
    onChangeSearchInputValue,
  };
};
