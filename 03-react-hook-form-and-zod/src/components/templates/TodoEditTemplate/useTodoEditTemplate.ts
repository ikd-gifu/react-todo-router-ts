import { useState, useCallback, ChangeEvent } from 'react';
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

  // タイトル入力フィールドの状態管理、内容入力フィールドの状態管理
  // フォーム送信とTodoの実際の変更処理を分離
  // UIハンドラーをtemplateから移動
  /**
   * title変更処理
   * @param {ChangeEvent<HTMLInputElement>} e - 入力イベント
   */
  const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  /**
   * content変更処理
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 入力イベント
   */
  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  /**
   * Todo更新処理
   */
  // <form>を使わないのでe: FormEventなど不要
  const onClickUpdate = useCallback(() => {
    if (todo && title !== '') {
      handleUpdateTodo(todo.id, title, content);
      navigate(NAV_ITEMS.TOP);
    }
  }, [todo, title, content, handleUpdateTodo, navigate]);

  return {
    todo,
    title,
    content,
    onChangeTitle,
    onChangeContent,
    onClickUpdate,
  };
};
