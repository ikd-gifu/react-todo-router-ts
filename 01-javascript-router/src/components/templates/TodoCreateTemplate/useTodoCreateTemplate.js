import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';
import { NAV_ITEMS } from '../../../constants/navigation';

/**
 * TodoCreateTemplateのページ固有UI状態管理
 * フォーム入力の状態とバリデーション、送信処理を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoCreateTemplate = () => {
  const navigate = useNavigate();
  const { handleCreateTodo } = useTodoContext();
  
  // フォーム入力値の状態管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  /**
   * Todo作成処理
   * バリデーションを行い、問題なければデータを保存して一覧画面に遷移
   */
  const onClickCreate = useCallback(() => {
    // バリデーション: タイトルが空の場合はアラート表示
    if (title.trim() === '') {
      alert('タイトルを入力してください');
      return;
    }

    // グローバル状態にデータを追加
    handleCreateTodo(title, content);
    
    // 一覧画面に遷移
    navigate(NAV_ITEMS.TOP);
  }, [title, content, handleCreateTodo, navigate]);

  return {
    title,
    setTitle,
    content,
    setContent,
    onClickCreate,
  };
};
