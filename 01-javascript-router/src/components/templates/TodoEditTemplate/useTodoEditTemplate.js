import { useState } from 'react';
import { useParams } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';

/**
 * Todo編集テンプレート用のカスタムフック
 * URLパラメータからTodoを取得し、フォーム状態を提供
 */
export const useTodoEditTemplate = () => {
  const { id } = useParams(); // URLからidパラメータを取得
  const { originalTodoList } = useTodoContext();

  // URLパラメータのidに一致するTodoを取得
  const todo = originalTodoList.find((todo) => todo.id === Number(id));

  // フォームの状態管理（todoの初期値を直接設定）
  const [title, setTitle] = useState(todo?.title || '');
  const [content, setContent] = useState(todo?.content || '');

  return {
    todo,
    title,
    setTitle,
    content,
    setContent,
  };
};
