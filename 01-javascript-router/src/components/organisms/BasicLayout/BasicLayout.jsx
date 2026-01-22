// BasicLayout を新規作成、ページ全体の基本レイアウトを提供
// Atomic Design の原則（Organisms は機能的なコンポーネント）
import styles from "./style.module.css";

/**
 * 基本レイアウトコンポーネント
 * ページ全体の共通レイアウト（コンテナ、タイトル）を提供
 * 
 * @param {Object} props
 * @param {string} props.title - ページタイトル
 * @param {React.ReactNode} props.children - ページのメインコンテンツ
 */
export const BasicLayout = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
};
