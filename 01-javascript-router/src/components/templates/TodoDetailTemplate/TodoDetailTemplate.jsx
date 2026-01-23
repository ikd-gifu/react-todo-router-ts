import { useParams } from 'react-router';
import { useTodoContext } from '../../../hooks/useTodoContext';
import { InputForm, CommonTextArea } from '../../atoms';
import { BasicLayout } from '../../organisms';
import styles from './style.module.css';

/**
 * Todo詳細表示テンプレート
 * URLパラメータから取得したTodoの詳細情報を表示（読み取り専用）
 */
export const TodoDetailTemplate = () => {
  const { id } = useParams();
  const { originalTodoList } = useTodoContext();

  // URLパラメータのidに一致するTodoを取得
  // 計算コストが低いのでuseMemoは不要
  const todo = originalTodoList.find((todo) => todo.id === Number(id));

  return (
    <BasicLayout title="Todo詳細">
      <div className={styles.detailContainer}>
        <div className={styles.formGroup}>
          <InputForm
            inputValue={todo.title}
            placeholder="タイトル"
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <CommonTextArea
            inputValue={todo.content || ''}
            placeholder="内容"
            rows={5}
            disabled
          />
        </div>
      </div>
    </BasicLayout>
  );
};
