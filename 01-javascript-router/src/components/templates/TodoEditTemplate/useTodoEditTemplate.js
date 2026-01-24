import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';
import { NAV_ITEMS } from '../../../constants/navigation';

/**
 * Todo編集テンプレート用のカスタムフック
 * URLパラメータからTodoを取得し、フォーム状態と更新処理を提供
 */
export const useTodoEditTemplate = () => {
  const { id } = useParams(); // URLからidパラメータを取得
  const navigate = useNavigate();
  const { originalTodoList, handleUpdateTodo } = useTodoContext();

  // URLパラメータのidに一致するTodoを取得
  const todo = originalTodoList.find((todo) => todo.id === Number(id));

  // フォームの状態管理（todoの初期値を直接設定）
  const [title, setTitle] = useState(todo?.title || '');
  const [content, setContent] = useState(todo?.content || '');

  /**
   * Todo更新処理
   */
  const onClickUpdate = useCallback(() => {
    if (todo && title !== '') {
      handleUpdateTodo(todo.id, title, content);
      navigate(NAV_ITEMS.TOP);
    }
  }, [todo, title, content, handleUpdateTodo, navigate]);

  return {
    todo,
    title,
    setTitle,
    content,
    setContent,
    onClickUpdate,
  };
};
