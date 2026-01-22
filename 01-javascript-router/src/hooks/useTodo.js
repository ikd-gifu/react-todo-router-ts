import { useState, useMemo } from "react";
import { INITIAL_TODOS, INITIAL_UNIQUE_ID } from "../constants/data";

export const useTodo = () => {
  // todo listの状態管理
  // const [現在の値, 値を更新するための関数] = useState(初期値);
  const [originalTodoList, setOriginalTodoList] = useState(INITIAL_TODOS );
  // 重複しない ID を生成
  // const [uniqueId, setUniqueId] = useState(INITIAL_TODOS.length + 1); データはdata.jsで一元管理
  const [uniqueId, setUniqueId] = useState(INITIAL_UNIQUE_ID);
    // 検索用のキーワードの状態管理 初期値を空文字に設定
  const [searchInputValue, setSearchInputValue] = useState("");
  // 検索用の入力値に基づいて表示するTodoリストを絞り込む
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      // 検索キーワードに前方一致したTodoだけを一覧表示
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
  // originalTodoListかsearchInputValueが変化したときに再計算
  }, [originalTodoList, searchInputValue]);

  /**
   * Todo新規作成処理（フォームからの登録用）
   * @param {string} title - Todoのタイトル
   * @param {string} content - Todoの内容
   */
  const handleCreateTodo = (title, content = "") => {
    const nextId = uniqueId + 1;
    
    const newTodoList = [
      ...originalTodoList,
      {
        id: nextId,
        title,
        content,
      },
    ];
    
    setOriginalTodoList(newTodoList);
    setUniqueId(nextId);
  };

  // Todo削除処理 @param は /**  */ のJSDocコメント内で使う
  /**
  * @param {number} targetId - 削除対象のTodoのID
  * @param {string} targetTitle - 削除対象のTodoのタイトル
  */
  const handleDeleteTodo = (targetId, targetTitle) => {
    // 確認ダイアログを表示
    if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
      // 削除対象のID以外のTodoだけを残す
      const newTodoList = originalTodoList.filter((todo) => todo.id !== targetId);
      
      // 状態を更新
      setOriginalTodoList(newTodoList);
    }
  };

  return {
    showTodoList, // 状態
    searchInputValue,
    handleDeleteTodo, // 関数
    handleCreateTodo, // 新規作成処理（フォームから登録用）
    setSearchInputValue
  };
};
