import { useState, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';
import { NAV_ITEMS } from '../../../constants/navigation';
import { useForm } from 'react-hook-form';

// useFormはフォーム全体の型を明示しないと、
// handleSubmitやerrorsの型が曖昧になりやすいので、フォーム全体の型定義を作成
type TodoCreateFormValues = {
  title: string;
  // string | undefined と同義
  content?: string;
};

/**
 * TodoCreateTemplateのページ固有UI状態管理
 * フォーム入力の状態とバリデーション、送信処理を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoCreateTemplate = () => {
  const navigate = useNavigate();
  const { handleCreateTodo } = useTodoContext();
  
  // フォーム入力値の状態管理
  // useState('')で自動で型推論されるので、型注釈は不要
  // const [title, setTitle] = useState('');
  // const [content, setContent] = useState('');

  const {
    control, // コンポーネントを登録するためのメソッドを含む
    handleSubmit, // フォームの検証が成功した場合にフォーム データを送信するための関数
    formState: { errors }, // フォーム全体の状態に関する情報を含む フィールドエラーを持つオブジェクト
  } = useForm<TodoCreateFormValues>({
    defaultValues: {
      title: '',
      content: undefined,
    }
  });

  // タイトル入力フィールドの状態管理、内容入力フィールドの状態管理
  // フォーム送信とTodoの実際の作成処理を分離
  // UIハンドラーをtemplateから移動
  /**
   * title変更処理
   * @param {ChangeEvent<HTMLInputElement>} e - 入力イベント
   */
  // const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  //   setTitle(e.target.value);
  // }, []);

  /**
   * content変更処理
   * @param {ChangeEvent<HTMLTextAreaElement>} e - 入力イベント
   */
  // const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
  //   setContent(e.target.value);
  // }, []);


  const handleCreateSubmit = handleSubmit(
    useCallback(
      (values: TodoCreateFormValues) => {
        // undefinedを空文字に変換して渡すTodoCreateFormValuesの型契約に合わせる
        handleCreateTodo(values.title, values.content ?? "");
        navigate(NAV_ITEMS.TOP);
      },
      [handleCreateTodo, navigate]
    )
  );

  return {
    control,
    errors,
    handleCreateSubmit,
  };
};
