// BasicLayout を新規作成、ページ全体の基本レイアウトを提供
// Atomic Design の原則（Organisms は機能的なコンポーネント）
import { ButtonGroup } from '../../molecules';
import styles from "./style.module.css";
import { FC, ReactNode } from "react";

// 独自コンポーネントで、単一のHTML要素ではないので型を定義
type BasicLayoutProps = {
  title: string;
  children: ReactNode;
};

/**
 * 基本レイアウトコンポーネント
 * ページ全体の共通レイアウト（コンテナ、タイトル、ナビゲーション）を提供
 */
export const BasicLayout: FC<BasicLayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <ButtonGroup />
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
};
