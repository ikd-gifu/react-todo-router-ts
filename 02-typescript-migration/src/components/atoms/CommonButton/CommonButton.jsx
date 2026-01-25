// CommonButton を新規作成、再利用可能なボタンコンポーネント
// Atomic Design の原則（Atoms は純粋なUI）
// 状態を親で一元管理
import styles from "./style.module.css";

/**
 * 共通ボタンコンポーネント
 * Atomic Designのatoms層 - 状態を持たず、純粋なUIとして実装
 * 
 * @param {Object} props
 * @param {string} props.children - ボタンのテキスト
 * @param {Function} props.onClick - クリック時の処理
 */
export const CommonButton = ({ children, onClick }) => {
  return (
    <button 
      className={styles.button}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
