import { Controller } from 'react-hook-form';
import { useTodoEditTemplate } from './useTodoEditTemplate';
import { CommonButton } from '../../atoms';
import { InputFormValidation, TextAreaValidation } from '../../molecules';
import { BasicLayout } from '../../organisms';
import styles from './style.module.css';

/**
 * Todo編集テンプレート
 * URLパラメータから取得したTodoの編集フォームを提供
 */
export const TodoEditTemplate = () => {
  // カスタムフックでTodoデータ、フォーム状態、更新処理を取得
  const {
    todo,
    control,
    errors,
    handleEditSubmit,
  } = useTodoEditTemplate();

  // Todoが存在しない場合の表示
  if (!todo) {
    return (
      <BasicLayout title="Todo編集">
        <div className={styles.notFound}>
          <p>指定されたTodoが見つかりませんでした</p>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout title="Todo編集">
      <form className={styles.formGroup} onSubmit={handleEditSubmit}>
        <div className={styles.formGroup}>
          <Controller
            control={control}
            // RHFが値を紐づけるために、nameはuseTodoEditTemplateのschemaのキーと一致させる必要がある
            name="title"
            render={({ field }) => 
              <InputFormValidation
              // string 前提なので、?? "" を入れて 非制御→制御の警告回避
                inputValue={field.value ?? ""}
                placeholder="タイトルを入力"
                handleChangeValue={field.onChange}
                errorMessage={errors.title?.message}
              />
            }
          />
        </div>

        <div className={styles.formGroup}>
          <Controller
            control={control}
            name="content"
            render={({ field }) =>
              <TextAreaValidation
                inputValue={field.value ?? ""}
                placeholder="詳細な内容を入力（任意）"
                handleChangeValue={field.onChange}
                rows={5}
              />
            }
          />
        </div>

        <div className={styles.buttonGroup}>
          <CommonButton type="submit">
            更新
          </CommonButton>
        </div>
      </form>
    </BasicLayout>
  );
};
