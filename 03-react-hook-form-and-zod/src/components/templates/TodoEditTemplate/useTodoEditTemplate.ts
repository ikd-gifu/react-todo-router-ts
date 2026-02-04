import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';
import { NAV_ITEMS } from '../../../constants/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// オブジェクトスキーマを定義
const TodoEditFormSchema = z.object({
  title: 
    z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(20, { message: 'タイトルは20文字以内で入力してください' }),
  content:
    z
    .string()
    .optional(),
});

// 型をスキーマから拡張するためにz.inferを使用して型エイリアスを定義
// z.infer<typeof schema> にすると、schema から型を
// 自動生成できるため「型定義」と「バリデーション」
// を同じ schema に集約できます。
// 結果として型の二重管理やズレを防げます。
type TodoEditFormSchema = z.infer<typeof TodoEditFormSchema>;

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoEditFormSchema>({ // フォーム全体の状態管理と操作APIを提供するフック
    resolver: zodResolver(TodoEditFormSchema),
    // todo 未取得時でも string を保証するために ?? "" 
    // を使用することで、非制御→制御コンポーネントの警告を防ぐ
    defaultValues: {
      title: todo?.title ?? "",
      content: todo?.content ?? "",
    }
  });

  /**
   * Todo更新処理
   */
  // <form>を使わないのでe: FormEventなど不要
  const handleEditSubmit = handleSubmit(
    useCallback(
      (values: TodoEditFormSchema) => {
        if (todo && values.title !== '') {
          handleUpdateTodo(todo.id, values.title, values.content ?? "");
          navigate(NAV_ITEMS.TOP);
        }
        },
        [todo, handleUpdateTodo, navigate]
      )
  );

  return {
    todo,
    control,
    errors,
    handleEditSubmit,
  };
};
