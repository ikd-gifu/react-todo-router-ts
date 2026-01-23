import { useTodoEditTemplate } from './useTodoEditTemplate';
import { InputForm, CommonTextArea, CommonButton } from '../../atoms';
import { BasicLayout } from '../../organisms';
import styles from './style.module.css';

/**
 * Todo編集テンプレート
 * URLパラメータから取得したTodoの編集フォームを提供（表示のみ）
 */
export const TodoEditTemplate = () => {
  // カスタムフックでTodoデータとフォーム状態を取得
  const {
    todo,
    title,
    setTitle,
    content,
    setContent,
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
          handleChangeValue={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <CommonTextArea
          inputValue={content}
          placeholder="詳細な内容を入力（任意）"
          handleChangeValue={(e) => setContent(e.target.value)}
          rows={5}
        />
      </div>

      <div className={styles.buttonGroup}>
        <CommonButton>
          更新
        </CommonButton>
      </div>
    </BasicLayout>
  );
};
