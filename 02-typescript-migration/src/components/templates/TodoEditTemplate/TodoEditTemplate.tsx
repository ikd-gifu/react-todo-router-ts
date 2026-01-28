import { useTodoEditTemplate } from './useTodoEditTemplate';
import { InputForm, CommonTextArea, CommonButton } from '../../atoms';
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
    title,
    content,
    onChangeTitle,
    onChangeContent,
    onClickUpdate,
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
      <div className={styles.formGroup}>
        <InputForm
          inputValue={title}
          placeholder="タイトルを入力"
          handleChangeValue={onChangeTitle}
        />
      </div>

      <div className={styles.formGroup}>
        <CommonTextArea
          inputValue={content}
          placeholder="詳細な内容を入力（任意）"
          handleChangeValue={onChangeContent}
          rows={5}
        />
      </div>

      <div className={styles.buttonGroup}>
        <CommonButton onClick={onClickUpdate}>
          更新
        </CommonButton>
      </div>
    </BasicLayout>
  );
};
