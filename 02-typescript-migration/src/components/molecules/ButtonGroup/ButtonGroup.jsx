// ButtonGroup を新規作成、複数のボタンを横に並べるコンポーネント
// Atomic Design の原則（Molecules は複数のAtomsを組み合わせる）
import { LinkButton } from '../../atoms';
import { NAV_ITEMS } from '../../../constants/navigation';
import styles from "./style.module.css";

/**
 * ボタングループコンポーネント
 * Atomic Designのmolecules層 - 複数のLinkButtonを横に並べる
 * 
 * Top画面とTodo新規作成画面へのリンクボタンを提供
 */
export const ButtonGroup = () => {
  return (
    // セマンティックHTML: ナビゲーションであることを明示
    <nav className={styles.buttonGroup}>
      <ul className={styles.list}>
        <li><LinkButton to={NAV_ITEMS.TOP}>Topページ</LinkButton></li>
        <li><LinkButton to={NAV_ITEMS.CREATE}>Todo作成</LinkButton></li>
      </ul>
    </nav>
  );
};
