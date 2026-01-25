import { useState, useCallback } from "react";
import { INITIAL_TODOS, INITIAL_UNIQUE_ID } from "../constants/data";

/**
 * Todoのグローバル状態管理とCRUD操作
 * データの永続化に関わる処理のみを担当
 * Single Source of Truthとしてデータモデルを管理
 */
export const useTodo = () => {
  // todo listの状態管理
  // const [現在の値, 値を更新するための関数] = useState(初期値);
  const [originalTodoList, setOriginalTodoList] = useState(INITIAL_TODOS );
  // 重複しない ID を生成
  // const [uniqueId, setUniqueId] = useState(INITIAL_TODOS.length + 1); データはdata.jsで一元管理
  const [uniqueId, setUniqueId] = useState(INITIAL_UNIQUE_ID);

  /**
   * Todo新規作成処理（フォームからの登録用）
   * @param {string} title - Todoのタイトル
   * @param {string} content - Todoの内容
   */
  const handleCreateTodo = useCallback((title, content = "") => {
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
  }, [uniqueId, originalTodoList]);

  // Todo削除処理 @param は /**  */ のJSDocコメント内で使う
  /**
  * @param {number} targetId - 削除対象のTodoのID
  * @param {string} targetTitle - 削除対象のTodoのタイトル
  */
  const handleDeleteTodo = useCallback((targetId, targetTitle) => {
    // 確認ダイアログを表示
    if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
      // 削除対象のID以外のTodoだけを残す
      const newTodoList = originalTodoList.filter((todo) => todo.id !== targetId);
      
      // 状態を更新
      setOriginalTodoList(newTodoList);
    }
  }, [originalTodoList]);

  /**
   * Todo更新処理
   * @param {number} targetId - 更新対象のTodoのID
   * @param {string} title - 新しいタイトル
   * @param {string} content - 新しい内容
   */
  const handleUpdateTodo = useCallback((targetId, title, content) => {
    const newTodoList = originalTodoList.map((todo) =>
      todo.id === targetId
        ? { ...todo, title, content }
        : todo
    );
    setOriginalTodoList(newTodoList);
  }, [originalTodoList]);

  return {
    originalTodoList, // データソース
    handleCreateTodo, // 新規作成処理（フォームから登録用）
    handleDeleteTodo, // 削除処理
    handleUpdateTodo, // 更新処理
  };
};
