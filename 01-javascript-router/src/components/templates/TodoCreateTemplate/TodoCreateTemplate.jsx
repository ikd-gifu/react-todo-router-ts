import { useTodoCreateTemplate } from './useTodoCreateTemplate';
import { InputForm, CommonTextArea, CommonButton } from '../../atoms';
import { BasicLayout } from '../../organisms';
import styles from './style.module.css';

/**
 * Todo新規作成テンプレート
 * titleとcontentの入力フォームを提供
 */
export const TodoCreateTemplate = () => {
  // ページ固有のカスタムフックでフォーム状態を管理
  const {
    title,
    setTitle,
    content,
    setContent,
    onClickCreate,
  } = useTodoCreateTemplate();

  return (
    <BasicLayout title="Todo新規作成">
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
        <CommonButton onClick={onClickCreate}>
          作成
        </CommonButton>
      </div>
    </BasicLayout>
  );
};
