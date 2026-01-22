// LinkButton を新規作成、ナビゲーション用のボタンコンポーネント
// Atomic Design の原則（Atoms は純粋なUI）
import { useNavigate } from 'react-router';
import styles from "./style.module.css";

/**
 * リンクボタンコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 * 
 * @param {Object} props
 * @param {string} props.children - ボタンのテキスト
 * @param {string} props.to - 遷移先のパス
 */
export const LinkButton = ({ children, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button 
      className={styles.linkButton}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
