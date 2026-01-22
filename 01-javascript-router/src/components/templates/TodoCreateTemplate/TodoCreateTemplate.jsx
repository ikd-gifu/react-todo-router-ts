import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';
import { InputForm, CommonTextArea, CommonButton } from '../../atoms';
import { BasicLayout } from '../../organisms';
import { NAV_ITEMS } from '../../../constants/navigation';
import styles from './style.module.css';

/**
 * Todo新規作成テンプレート
 * titleとcontentの入力フォームを提供
 */
export const TodoCreateTemplate = () => {
  const navigate = useNavigate();
  const { handleCreateTodo } = useTodoContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  /**
   * Todo作成処理
   */
  const onClickCreate = () => {
    if (title.trim() === '') {
      alert('タイトルを入力してください');
      return;
    }

    handleCreateTodo(title, content);
    // 一覧画面に遷移
    navigate(NAV_ITEMS.TOP);
  };

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
